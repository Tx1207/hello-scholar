"""Deterministic validation for saved hello-scholar Skill Eval evidence."""

from __future__ import annotations

from dataclasses import dataclass, replace
import hashlib
import json
import math
import os
from pathlib import Path, PurePosixPath
import re
import stat
from typing import Any, Iterable


IGNORED_TREE_NAMES = {
    ".git",
    "__pycache__",
    ".DS_Store",
    ".hello-scholar-install.json",
}
LOAD_VALUES = {
    "absent",
    "pre-change-explicit-file",
    "current-explicit-file",
}
BASELINE_LOAD_VALUES = {"absent", "pre-change-explicit-file"}
LIVE_LOAD_VALUE = "current-explicit-file"
BRANCH_VALUES = {"enter", "exit", "optional"}
DIFF_STATES = {
    "committed",
    "index",
    "workingTree",
    "untracked",
    "finalHashes",
}
FIXTURE_EVIDENCE_STATES = {
    "committed",
    "index",
    "working-tree",
    "untracked",
    "final-hashes",
}
KEBAB_CASE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
HEX_SHA256 = re.compile(r"^[0-9a-f]{64}$")
GIT_COMMIT = re.compile(r"^[0-9a-f]{7,64}$")
RUBRIC_SCORE_VALUES = {0, 90, 100}
RUBRIC_ANCHOR_KEYS = {str(value) for value in RUBRIC_SCORE_VALUES}
USER_VALUE_RUBRIC_PATH = "test/skill-evals/user-value-rubric.json"
USER_VALUE_RUBRIC_ID = "hello-scholar-user-value-v1"
FORMAL_PROTOCOL_MODELS = {
    2: "gpt-5.6-terra",
    3: "claude-sonnet-5",
}
TERRA_EVAL_AGENT_MODEL = FORMAL_PROTOCOL_MODELS[2]
SONNET_EVAL_AGENT_MODEL = FORMAL_PROTOCOL_MODELS[3]
FROZEN_V2_BASELINES = {
    "test/skill-evals/brainstorming-api-route": {
        "protocolSha256": "b356dc19f13a13675a38a34c243fc4359ead2aea011add3d7ba4dc7c403d5165",
        "baselineSha256": "ef76d5b585646dd4505a5358534fd4706e4c15400a4a8e00733b48265025fd87",
    },
    "test/skill-evals/brainstorming-spec-bundle": {
        "protocolSha256": "6a7771c79998b7e0129fccf7512f191fc01a82feb2d432eea2966e38f7a92fa6",
        "baselineSha256": "22f7d0b1fda60ed13c3a61fda407d61da92b773f8f9139ac301ee43ea7eb038b",
    },
    "test/skill-evals/crash-audit-calibrated-none": {
        "protocolSha256": "f88f363c13b4fe61c2c78a1da222abd43bfdfe7bd00b257e371d808c01fb691b",
        "baselineSha256": "c5b9a16f1388839c3461a232268e068b85bc9d334c404d1c3b8cf399570eafba",
    },
    "test/skill-evals/crash-audit-release-blind-spot": {
        "protocolSha256": "478ef137dd39e26d40c8c90fe7023302e92d875621101e12c8dcd5fd0f996c94",
        "baselineSha256": "eb96f902f40fa3500870adecd6235ea10f39596efc1cbf30441644dd5649fd34",
    },
    "test/skill-evals/generating-tasks": {
        "protocolSha256": "887b36c8fa2205cb184c0ef59a419768dac2bc0c799abae57a554c0e24094021",
        "baselineSha256": "90d8a8b328ccd06e339607bd7b441d8baf7220fbc2d04bfde291f25a68428da6",
    },
    "test/skill-evals/generating-tasks-migration": {
        "protocolSha256": "6295c1715525f0af9533b3bfeef41a187f716a1625c0a203b2453fba19a1a252",
        "baselineSha256": "a2f5424780bdc5933b3b25cf38ac44d0dcd9815d20941b702929cd41f016e48e",
    },
    "test/skill-evals/manage-specs-existing": {
        "protocolSha256": "5c64ae8286e11aa4645635c0fd77bdcd6699bf9348844667df6dede669251164",
        "baselineSha256": "a9db0547303ea10090f18080a1ea1777045818fa88d8098229a9c3787f97dbcd",
    },
    "test/skill-evals/manage-specs-successor": {
        "protocolSha256": "39bf6e840b141d9770846c5d5b88de32f55346ef3023d9424cd08daf819b0a27",
        "baselineSha256": "fcc3cb6f98f5db1d584e42f449a96ce496e339d142ca5ce2016a2672fb623e69",
    },
}
FROZEN_V2_SCORECARDS = {
    "test/skill-evals/generating-tasks": {
        "protocolSha256": "887b36c8fa2205cb184c0ef59a419768dac2bc0c799abae57a554c0e24094021",
        "scorecardSha256": "86156f77cf90a2375c35e075bf0b9ef3622fc4bd87d8e7b6c155c80acaa8fa6d",
    },
}
USER_VALUE_DIMENSION_IDS = {
    "value-visibility",
    "audience-fit",
    "information-design",
    "actionability",
    "signal-to-noise",
}
FIXTURE_RUNTIME_NAMES = {
    "__pycache__",
    ".DS_Store",
    ".hello-scholar-install.json",
}
FIXTURE_RUNTIME_SUFFIXES = {".pyc", ".pyo"}


class ContractError(ValueError):
    """Raised when deterministic hashing encounters an unsafe filesystem node."""


@dataclass(frozen=True)
class ScenarioResult:
    """Independent stage outcomes for one scenario directory."""

    scenario_dir: Path
    scenario_id: str | None
    case_id: str | None
    project_id: str | None
    primary_skill: str | None
    counts_toward_product_skill: bool
    contract_valid: bool
    baseline_red: bool
    evaluation_passed: bool
    user_accepted: bool
    errors: tuple[str, ...]


def _is_link(path: Path, node_stat: os.stat_result | None = None) -> bool:
    """Purpose: detect unsafe links; Input: path and optional lstat; Output: true for a symlink or junction."""
    node_stat = node_stat or path.lstat()
    return stat.S_ISLNK(node_stat.st_mode) or bool(
        getattr(node_stat, "st_reparse_tag", 0)
    )


def _require_regular_file(path: Path) -> os.stat_result:
    """Purpose: require a plain evidence file; Input: path; Output: lstat metadata; Errors: ContractError for missing or unsafe nodes."""
    try:
        node_stat = path.lstat()
    except FileNotFoundError as error:
        raise ContractError(f"missing file: {path}") from error
    if _is_link(path, node_stat):
        raise ContractError(f"symlink or junction is not allowed: {path}")
    if not stat.S_ISREG(node_stat.st_mode):
        raise ContractError(f"expected regular file: {path}")
    return node_stat


def sha256_file(path: str | Path) -> str:
    """Purpose: hash one safe file; Input: file path; Output: SHA-256 hex; Errors: ContractError for missing or unsafe nodes."""

    file_path = Path(path)
    _require_regular_file(file_path)
    digest = hashlib.sha256()
    with file_path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _tree_files(root: Path) -> Iterable[tuple[str, Path]]:
    """Purpose: enumerate a safe tree deterministically; Input: root directory; Output: relative-path/file pairs; Errors: ContractError for unsafe nodes."""
    try:
        root_stat = root.lstat()
    except FileNotFoundError as error:
        raise ContractError(f"missing directory: {root}") from error
    if _is_link(root, root_stat):
        raise ContractError(f"symlink or junction is not allowed: {root}")
    if not stat.S_ISDIR(root_stat.st_mode):
        raise ContractError(f"expected directory: {root}")

    pending = [root]
    files: list[tuple[str, Path]] = []
    while pending:
        directory = pending.pop()
        with os.scandir(directory) as entries:
            for entry in entries:
                if entry.name in IGNORED_TREE_NAMES:
                    continue
                path = Path(entry.path)
                node_stat = path.lstat()
                if _is_link(path, node_stat):
                    raise ContractError(f"symlink or junction is not allowed: {path}")
                if stat.S_ISDIR(node_stat.st_mode):
                    pending.append(path)
                elif stat.S_ISREG(node_stat.st_mode):
                    files.append((path.relative_to(root).as_posix(), path))
                else:
                    raise ContractError(f"special filesystem node is not allowed: {path}")
    yield from sorted(files, key=lambda item: item[0])


def sha256_tree(path: str | Path) -> str:
    """Purpose: hash one safe directory tree; Input: directory path; Output: deterministic SHA-256; Errors: ContractError for unsafe nodes."""

    root = Path(path)
    digest = hashlib.sha256()
    for relative, file_path in _tree_files(root):
        digest.update(relative.encode("utf-8"))
        digest.update(b"\0")
        with file_path.open("rb") as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                digest.update(chunk)
        digest.update(b"\0")
    return digest.hexdigest()


def _load_json(path: Path, errors: list[str], label: str) -> dict[str, Any] | None:
    """Purpose: load one required JSON object; Input: path, error sink, and label; Output: object or None; Side effects: appends diagnostics."""
    try:
        _require_regular_file(path)
        value = json.loads(path.read_text(encoding="utf-8"))
    except (ContractError, OSError, UnicodeError, json.JSONDecodeError) as error:
        errors.append(f"{label}: {error}")
        return None
    if not isinstance(value, dict):
        errors.append(f"{label}: expected a JSON object")
        return None
    return value


def _nonempty_string(value: Any) -> bool:
    """Purpose: test required text; Input: arbitrary value; Output: true for a nonblank string."""
    return isinstance(value, str) and bool(value.strip())


def _number(value: Any) -> bool:
    """Purpose: test finite JSON numbers without booleans; Input: arbitrary value; Output: true for a finite int or float."""
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _relative_contract_path(value: Any) -> bool:
    """Purpose: validate a repository-relative POSIX path; Input: arbitrary value; Output: true for a nonescaping relative path."""
    if not _nonempty_string(value) or "\\" in value:
        return False
    path = PurePosixPath(value)
    return not path.is_absolute() and ".." not in path.parts


def _validate_string_list(
    value: Any,
    field: str,
    errors: list[str],
    *,
    nonempty: bool = True,
    paths: bool = False,
) -> list[str]:
    """Purpose: validate a string-list protocol field; Input: value, field, error sink, and options; Output: valid items; Side effects: appends diagnostics."""
    if not isinstance(value, list) or (nonempty and not value):
        errors.append(f"protocol.{field}: expected a non-empty list")
        return []
    result: list[str] = []
    for index, item in enumerate(value):
        if not _nonempty_string(item):
            errors.append(f"protocol.{field}[{index}]: expected a non-empty string")
        elif paths and not _relative_contract_path(item):
            errors.append(f"protocol.{field}[{index}]: expected a safe POSIX relative path")
        else:
            result.append(item)
    return result


def _scenario_original_user_request(
    scenario_path: Path,
    errors: list[str],
) -> str | None:
    """Purpose: extract the only Implementer-visible Scenario section; Input: Scenario path and error sink; Output: original user request or None; Side effects: reads Markdown and appends diagnostics."""
    try:
        text = scenario_path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        errors.append(f"scenario.original-user-request: cannot read Scenario: {error}")
        return None
    matches = list(
        re.finditer(
            r"^## (?:Original User Request|原始用户请求)\s*$\n(.*?)(?=^## |\Z)",
            text,
            re.MULTILINE | re.DOTALL,
        )
    )
    if len(matches) != 1:
        errors.append(
            "scenario.original-user-request: expected exactly one level-two request section"
        )
        return None
    request = matches[0].group(1).strip()
    if not request:
        errors.append("scenario.original-user-request: expected non-empty request")
        return None
    return request


def _validate_user_value_rubric(
    protocol: dict[str, Any],
    repo_root: Path,
    errors: list[str],
) -> dict[str, Any] | None:
    """Purpose: load and validate the one shared user-value rubric; Input: Protocol, repository root, and error sink; Output: rubric object or None; Side effects: reads the rubric and appends diagnostics."""
    reference = protocol.get("userValueRubric")
    if not isinstance(reference, dict):
        errors.append("protocol.userValueRubric: expected object")
        return None
    path = reference.get("path")
    if path != USER_VALUE_RUBRIC_PATH:
        errors.append(
            f"protocol.userValueRubric.path: expected {USER_VALUE_RUBRIC_PATH}"
        )
        return None
    expected_hash = reference.get("sha256")
    if not isinstance(expected_hash, str) or not HEX_SHA256.fullmatch(expected_hash):
        errors.append("protocol.userValueRubric.sha256: expected SHA-256")
        return None

    rubric_path = repo_root / path
    rubric = _load_json(rubric_path, errors, "userValueRubric")
    if rubric is None:
        return None
    try:
        current_hash = sha256_file(rubric_path)
    except ContractError as error:
        errors.append(f"protocol.userValueRubric.sha256: {error}")
        return None
    if current_hash != expected_hash:
        errors.append(
            "protocol.userValueRubric.sha256: does not match current shared rubric"
        )

    if rubric.get("rubricId") != USER_VALUE_RUBRIC_ID:
        errors.append(
            f"userValueRubric.rubricId: expected {USER_VALUE_RUBRIC_ID}"
        )
    if rubric.get("rubricVersion") != 1:
        errors.append("userValueRubric.rubricVersion: expected 1")

    dimensions = rubric.get("dimensions")
    dimension_ids: list[str] = []
    weight_total = 0
    if not isinstance(dimensions, list) or not dimensions:
        errors.append("userValueRubric.dimensions: expected non-empty list")
    else:
        for index, dimension in enumerate(dimensions):
            field = f"userValueRubric.dimensions[{index}]"
            if not isinstance(dimension, dict):
                errors.append(f"{field}: expected object")
                continue
            dimension_id = dimension.get("id")
            if not _nonempty_string(dimension_id):
                errors.append(f"{field}.id: expected non-empty string")
            else:
                dimension_ids.append(dimension_id)
            weight = dimension.get("weight")
            if not isinstance(weight, int) or isinstance(weight, bool) or weight <= 0:
                errors.append(f"{field}.weight: expected positive integer")
            else:
                weight_total += weight
            if dimension.get("critical") is not True:
                errors.append(f"{field}.critical: expected true")
            if dimension.get("minimum") != 90:
                errors.append(f"{field}.minimum: expected fixed score 90")
            if not _nonempty_string(dimension.get("criterion")):
                errors.append(f"{field}.criterion: expected non-empty string")
    if set(dimension_ids) != USER_VALUE_DIMENSION_IDS or len(
        dimension_ids
    ) != len(USER_VALUE_DIMENSION_IDS):
        errors.append(
            "userValueRubric.dimensions: must contain the five fixed user-value dimensions exactly once"
        )
    if weight_total != 100:
        errors.append("userValueRubric.dimensions: weights must total 100")
    if rubric.get("minimumTotal") != 90:
        errors.append("userValueRubric.minimumTotal: expected fixed score 90")
    anchors = rubric.get("scoreAnchors")
    if not isinstance(anchors, dict) or set(anchors) != RUBRIC_ANCHOR_KEYS:
        errors.append("userValueRubric.scoreAnchors: expected exact 0/90/100 anchors")
    else:
        for score, meaning in anchors.items():
            if not _nonempty_string(meaning):
                errors.append(
                    f"userValueRubric.scoreAnchors.{score}: expected non-empty meaning"
                )
    return rubric


def _validate_legacy_speed_protocol(
    value: Any,
    errors: list[str],
) -> None:
    """Purpose: preserve the frozen v1 timeout check; Input: legacy speed object and error sink; Output: none; Side effects: appends diagnostics."""
    if not isinstance(value, dict) or not _number(
        value.get("absoluteTimeoutSeconds")
    ) or value["absoluteTimeoutSeconds"] <= 0:
        errors.append("protocol.speed.absoluteTimeoutSeconds: expected positive number")


def _validate_protocol(
    protocol: dict[str, Any],
    repo_root: Path,
    errors: list[str],
) -> dict[str, Any] | None:
    """Purpose: validate one Eval Protocol object; Input: protocol, repository root, and error sink; Output: shared user-value rubric for a formal cohort or None; Side effects: reads shared rubric and appends diagnostics."""
    protocol_version = protocol.get("protocolVersion")
    if protocol_version != 1 and protocol_version not in FORMAL_PROTOCOL_MODELS:
        errors.append("protocol.protocolVersion: expected 1, 2, or 3")
    is_formal = protocol_version in FORMAL_PROTOCOL_MODELS

    for field in ("scenarioId", "projectId", "primarySkill", "caseId"):
        value = protocol.get(field)
        if not _nonempty_string(value) or not KEBAB_CASE.fullmatch(value):
            errors.append(f"protocol.{field}: expected kebab-case")

    counts = protocol.get("countsTowardProductSkill")
    if not isinstance(counts, bool):
        errors.append("protocol.countsTowardProductSkill: expected boolean")

    target_skills = _validate_string_list(
        protocol.get("targetSkills"), "targetSkills", errors
    )
    if len(set(target_skills)) != len(target_skills):
        errors.append("protocol.targetSkills: duplicate skill")
    for skill in target_skills:
        if not KEBAB_CASE.fullmatch(skill):
            errors.append(f"protocol.targetSkills: invalid skill name {skill!r}")
    primary = protocol.get("primarySkill")
    if counts is True and primary not in target_skills:
        errors.append("protocol.primarySkill: counted case owner must be a target skill")
    if counts is False and primary not in target_skills and primary != "framework-e2e":
        errors.append("protocol.primarySkill: uncounted non-target owner must be framework-e2e")

    sources = protocol.get("skillSources")
    if not isinstance(sources, dict) or set(sources) != set(target_skills):
        errors.append("protocol.skillSources: keys must exactly match targetSkills")
    else:
        for skill, source in sources.items():
            if not _relative_contract_path(source):
                errors.append(
                    f"protocol.skillSources.{skill}: expected a safe POSIX relative path"
                )

    expectations = protocol.get("skillExpectations")
    if not isinstance(expectations, dict) or set(expectations) != set(target_skills):
        errors.append("protocol.skillExpectations: keys must exactly match targetSkills")
    else:
        for skill, expectation in expectations.items():
            field = f"protocol.skillExpectations.{skill}"
            if not isinstance(expectation, dict):
                errors.append(f"{field}: expected object")
                continue
            branch = expectation.get("branch")
            if is_formal:
                baseline_load = expectation.get("baselineLoad")
                live_load = expectation.get("liveLoad")
                if baseline_load not in BASELINE_LOAD_VALUES:
                    errors.append(f"{field}.baselineLoad: invalid value")
                if live_load != LIVE_LOAD_VALUE:
                    errors.append(
                        f"{field}.liveLoad: expected {LIVE_LOAD_VALUE}"
                    )
            else:
                baseline_load = expectation.get("load")
                if baseline_load not in LOAD_VALUES:
                    errors.append(f"{field}.load: invalid value")
            if branch not in BRANCH_VALUES:
                errors.append(f"{field}.branch: invalid value")
            if baseline_load == "absent" and branch == "exit":
                errors.append(
                    f"{field}: absent cannot prove an instruction branch exit"
                )

    activation = protocol.get("activationProbe")
    if not isinstance(activation, dict) or not isinstance(
        activation.get("observable"), bool
    ):
        errors.append("protocol.activationProbe.observable: expected boolean")
    instruction = protocol.get("instructionEval")
    if not isinstance(instruction, dict) or instruction.get(
        "claimsAutomaticActivation"
    ) is not False:
        errors.append(
            "protocol.instructionEval.claimsAutomaticActivation: expected false"
        )

    if is_formal:
        prompt_projection = protocol.get("promptProjection")
        if not isinstance(prompt_projection, dict):
            errors.append("protocol.promptProjection: expected object")
        else:
            for field in (
                "rawScenarioVisibleToImplementer",
                "rawProtocolVisibleToImplementer",
                "futureRoundsVisibleToImplementer",
            ):
                if prompt_projection.get(field) is not False:
                    errors.append(f"protocol.promptProjection.{field}: expected false")

    user_value_rubric = (
        _validate_user_value_rubric(protocol, repo_root, errors) if is_formal else None
    )

    agents = protocol.get("agents")
    if not isinstance(agents, dict):
        errors.append("protocol.agents: expected object")
    else:
        for field in ("implementers", "reviewers"):
            value = agents.get(field)
            if not isinstance(value, int) or isinstance(value, bool) or value < 1:
                errors.append(f"protocol.agents.{field}: expected positive integer")
        if agents.get("forkTurns") != "none":
            errors.append("protocol.agents.forkTurns: expected none")
        expected_model = FORMAL_PROTOCOL_MODELS.get(protocol_version)
        if is_formal and agents.get("model") != expected_model:
            errors.append(
                f"protocol.agents.model: expected {expected_model}"
            )

    fixture = protocol.get("fixture")
    if not isinstance(fixture, dict):
        errors.append("protocol.fixture: expected object")
    else:
        if not _nonempty_string(fixture.get("baseCommitRule")):
            errors.append("protocol.fixture.baseCommitRule: expected non-empty string")
        states = fixture.get("evidenceStates")
        if not isinstance(states, list) or set(states) != FIXTURE_EVIDENCE_STATES:
            errors.append(
                "protocol.fixture.evidenceStates: must cover committed/index/working-tree/untracked/final-hashes"
            )

    rubric = protocol.get("rubric")
    if not isinstance(rubric, dict):
        errors.append("protocol.rubric: expected object")
    else:
        dimensions = rubric.get("dimensions")
        dimension_ids: list[str] = []
        weight_total = 0
        if not isinstance(dimensions, list) or not dimensions:
            errors.append("protocol.rubric.dimensions: expected non-empty list")
        else:
            for index, dimension in enumerate(dimensions):
                field = f"protocol.rubric.dimensions[{index}]"
                if not isinstance(dimension, dict):
                    errors.append(f"{field}: expected object")
                    continue
                dimension_id = dimension.get("id")
                if not _nonempty_string(dimension_id) or not KEBAB_CASE.fullmatch(
                    dimension_id
                ):
                    errors.append(f"{field}.id: expected kebab-case")
                else:
                    dimension_ids.append(dimension_id)
                weight = dimension.get("weight")
                if not isinstance(weight, int) or isinstance(weight, bool) or weight <= 0:
                    errors.append(f"{field}.weight: expected positive integer")
                else:
                    weight_total += weight
                if not isinstance(dimension.get("critical"), bool):
                    errors.append(f"{field}.critical: expected boolean")
                minimum = dimension.get("minimum")
                if is_formal:
                    if minimum != 90:
                        errors.append(f"{field}.minimum: expected fixed score 90")
                    if not _nonempty_string(dimension.get("criterion")):
                        errors.append(f"{field}.criterion: expected non-empty string")
                elif not _number(minimum) or not 0 <= minimum <= 100:
                    errors.append(f"{field}.minimum: expected score from 0 to 100")
        if len(set(dimension_ids)) != len(dimension_ids):
            errors.append("protocol.rubric.dimensions: duplicate id")
        if weight_total != 100:
            errors.append("protocol.rubric.dimensions: weights must total 100")
        minimum_total = rubric.get("minimumTotal")
        if is_formal:
            if minimum_total != 90:
                errors.append("protocol.rubric.minimumTotal: expected fixed score 90")
            anchors = rubric.get("scoreAnchors")
            if not isinstance(anchors, dict) or set(anchors) != RUBRIC_ANCHOR_KEYS:
                errors.append("protocol.rubric.scoreAnchors: expected exact 0/90/100 anchors")
            else:
                for score, meaning in anchors.items():
                    if not _nonempty_string(meaning):
                        errors.append(
                            f"protocol.rubric.scoreAnchors.{score}: expected non-empty meaning"
                        )
        elif not _number(minimum_total) or not 0 <= minimum_total <= 100:
            errors.append("protocol.rubric.minimumTotal: expected score from 0 to 100")
        _validate_string_list(rubric.get("hardRejects"), "rubric.hardRejects", errors)

    if is_formal:
        if not _nonempty_string(protocol.get("criticalPath")):
            errors.append(
                "protocol.criticalPath: expected a non-empty observable workflow"
            )
        for retired_field in ("speed", "speedLimits"):
            if retired_field in protocol:
                errors.append(
                    f"protocol.{retired_field}: wall-clock quality fields are not allowed in formal Protocols"
                )
    else:
        _validate_legacy_speed_protocol(protocol.get("speed"), errors)

    _validate_string_list(protocol.get("commands"), "commands", errors)
    for group in ("paths", "artifacts"):
        value = protocol.get(group)
        if not isinstance(value, dict):
            errors.append(f"protocol.{group}: expected object")
            continue
        keys = ("allow", "deny") if group == "paths" else ("expected", "forbidden")
        for key in keys:
            _validate_string_list(
                value.get(key),
                f"{group}.{key}",
                errors,
                nonempty=False,
                paths=True,
            )

    interaction = protocol.get("interaction")
    if not isinstance(interaction, dict):
        errors.append("protocol.interaction: expected object")
    else:
        if interaction.get("firstPromptIncludesFutureReplies") is not False:
            errors.append(
                "protocol.interaction.firstPromptIncludesFutureReplies: expected false"
            )
        rounds = interaction.get("rounds")
        if not isinstance(rounds, list) or not rounds:
            errors.append("protocol.interaction.rounds: expected non-empty list")
        else:
            for index, round_spec in enumerate(rounds):
                field = f"protocol.interaction.rounds[{index}]"
                if not isinstance(round_spec, dict):
                    errors.append(f"{field}: expected object")
                    continue
                if round_spec.get("sender") not in {"user", "eval-main"}:
                    errors.append(f"{field}.sender: invalid value")
                if not _nonempty_string(round_spec.get("stopCondition")):
                    errors.append(f"{field}.stopCondition: expected non-empty string")
                if not _nonempty_string(round_spec.get("contentRole")):
                    errors.append(f"{field}.contentRole: expected non-empty string")
                if is_formal and index == 0:
                    if round_spec.get("sender") != "user":
                        errors.append(f"{field}.sender: first round must be user")
                    if round_spec.get("messageSource") != "scenario.original-user-request":
                        errors.append(
                            f"{field}.messageSource: expected scenario.original-user-request"
                        )
                    if "message" in round_spec:
                        errors.append(f"{field}.message: first round must use messageSource")
                elif is_formal:
                    if round_spec.get("sender") != "eval-main":
                        errors.append(f"{field}.sender: future round must be eval-main")
                    if not _nonempty_string(round_spec.get("message")):
                        errors.append(f"{field}.message: expected exact future message")
    return user_value_rubric


def _current_input_hashes(scenario_dir: Path, errors: list[str]) -> dict[str, str]:
    """Purpose: hash the current Proposal inputs; Input: scenario directory and error sink; Output: available scenario, protocol, and Fixture hashes; Side effects: reads files and appends diagnostics."""
    hashes: dict[str, str] = {}
    targets = {
        "scenarioSha256": scenario_dir / "scenario.md",
        "protocolSha256": scenario_dir / "protocol.json",
    }
    for field, target in targets.items():
        try:
            hashes[field] = sha256_file(target)
        except ContractError as error:
            errors.append(f"{field}: {error}")
    try:
        hashes["fixtureSha256"] = sha256_tree(scenario_dir / "fixture")
    except ContractError as error:
        errors.append(f"fixtureSha256: {error}")
    return hashes


def _validate_fixture_runtime_artifacts(
    fixture_root: Path,
    errors: list[str],
) -> None:
    """Purpose: reject unhashed runtime artifacts from Proposal Fixtures; Input: Fixture root and error sink; Output: none; Side effects: reads directory entries and appends diagnostics."""
    try:
        root_stat = fixture_root.lstat()
    except FileNotFoundError:
        return
    if _is_link(fixture_root, root_stat) or not stat.S_ISDIR(root_stat.st_mode):
        return

    pending = [fixture_root]
    while pending:
        directory = pending.pop()
        with os.scandir(directory) as entries:
            for entry in entries:
                path = Path(entry.path)
                relative = path.relative_to(fixture_root).as_posix()
                suffix = path.suffix.lower()
                if entry.name in FIXTURE_RUNTIME_NAMES or suffix in FIXTURE_RUNTIME_SUFFIXES:
                    errors.append(f"Fixture runtime artifact: {relative}")
                    continue
                node_stat = path.lstat()
                if not _is_link(path, node_stat) and stat.S_ISDIR(node_stat.st_mode):
                    pending.append(path)


def _validate_hash_bindings(
    value: dict[str, Any],
    current_hashes: dict[str, str],
    label: str,
    errors: list[str],
) -> None:
    """Purpose: verify saved hashes against current Proposal inputs; Input: bound object, current hashes, label, and error sink; Output: none; Side effects: appends diagnostics."""
    for field in ("scenarioSha256", "protocolSha256", "fixtureSha256"):
        actual = value.get(field)
        if not isinstance(actual, str) or not HEX_SHA256.fullmatch(actual):
            errors.append(f"{label}.{field}: expected SHA-256")
        elif field in current_hashes and actual != current_hashes[field]:
            errors.append(f"{label}.{field}: does not match current input")


def _validate_approval(
    approval: dict[str, Any],
    current_hashes: dict[str, str],
    errors: list[str],
) -> None:
    """Purpose: validate a Proposal approval and its hash binding; Input: approval, current hashes, and error sink; Output: none; Side effects: appends diagnostics."""
    if not _nonempty_string(approval.get("proposalId")):
        errors.append("approval.proposalId: expected non-empty string")
    decision = approval.get("decision")
    if decision not in {"pending", "approved"}:
        errors.append("approval.decision: expected pending or approved")
    if decision == "approved" and not _nonempty_string(approval.get("replyEvidence")):
        errors.append("approval.replyEvidence: required for approved proposal")
    _validate_hash_bindings(approval, current_hashes, "approval", errors)


def _safe_evidence_file(
    scenario_dir: Path,
    reference: Any,
    field: str,
    errors: list[str],
) -> None:
    """Purpose: validate one immutable evidence reference; Input: scenario root, reference, field label, and error sink; Output: none; Side effects: reads evidence and appends diagnostics."""
    if not isinstance(reference, dict):
        errors.append(f"{field}: evidence reference must be an object")
        return
    value = reference.get("path")
    expected_hash = reference.get("sha256")
    if not _relative_contract_path(value):
        errors.append(f"{field}.path: evidence path must stay inside scenario directory")
        return
    if not isinstance(expected_hash, str) or not HEX_SHA256.fullmatch(expected_hash):
        errors.append(f"{field}.sha256: expected SHA-256")
        return

    current = scenario_dir
    try:
        for part in PurePosixPath(value).parts:
            current = current / part
            node_stat = current.lstat()
            if _is_link(current, node_stat):
                errors.append(f"{field}.path: symlink or junction is not allowed")
                return
        _require_regular_file(current)
        if sha256_file(current) != expected_hash:
            errors.append(f"{field}.sha256: evidence hash mismatch")
    except (ContractError, FileNotFoundError, OSError) as error:
        errors.append(f"{field}: invalid evidence: {error}")


def _validate_evidence_list(
    scenario_dir: Path,
    value: Any,
    field: str,
    errors: list[str],
) -> None:
    """Purpose: validate a required list of evidence references; Input: scenario root, value, field label, and error sink; Output: none; Side effects: reads evidence and appends diagnostics."""
    if not isinstance(value, list) or not value:
        errors.append(f"{field}: expected non-empty evidence list")
        return
    for index, reference in enumerate(value):
        _safe_evidence_file(scenario_dir, reference, f"{field}[{index}]", errors)


def _validate_checks(
    scenario_dir: Path,
    value: Any,
    field: str,
    errors: list[str],
    *,
    require_all_passed: bool = False,
) -> list[bool]:
    """Purpose: validate hard-gate or environment checks; Input: scenario root, check list, field label, error sink, and pass requirement; Output: valid passed flags; Side effects: reads evidence and appends diagnostics."""
    if not isinstance(value, list) or not value:
        errors.append(f"{field}: expected non-empty list")
        return []
    passed_values: list[bool] = []
    for index, item in enumerate(value):
        item_field = f"{field}[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{item_field}: expected object")
            continue
        if not _nonempty_string(item.get("id")):
            errors.append(f"{item_field}.id: expected non-empty string")
        passed = item.get("passed")
        if not isinstance(passed, bool):
            errors.append(f"{item_field}.passed: expected boolean")
        else:
            passed_values.append(passed)
            if require_all_passed and not passed:
                errors.append(f"{item_field}.passed: environment check must pass")
        if "reason" in item and not _nonempty_string(item.get("reason")):
            errors.append(f"{item_field}.reason: expected non-empty string")
        _validate_evidence_list(
            scenario_dir, item.get("evidence"), f"{item_field}.evidence", errors
        )
    return passed_values


def _command_resolution_matches(protocol_command: str, executed_command: str) -> bool:
    """Purpose: compare an executed command with its approved template; Input: Protocol command and resolved command; Output: true when only angle-bracket placeholders were replaced."""
    parts = re.split(r"(<[^<>\r\n]+>)", protocol_command)
    if len(parts) == 1:
        return executed_command == protocol_command
    placeholders: dict[str, str] = {}
    pattern_parts: list[str] = []
    for part in parts:
        if not part.startswith("<"):
            pattern_parts.append(re.escape(part))
            continue
        group = placeholders.get(part)
        if group is None:
            group = f"placeholder_{len(placeholders)}"
            placeholders[part] = group
            pattern_parts.append(fr"(?P<{group}>[^<>\r\n]+)")
        else:
            pattern_parts.append(fr"(?P={group})")
    pattern = "".join(pattern_parts)
    return re.fullmatch(pattern, executed_command) is not None


def _validate_commands(
    scenario_dir: Path,
    value: Any,
    expected_commands: Any,
    is_formal: bool,
    field: str,
    errors: list[str],
) -> list[int]:
    """Purpose: validate recorded command outcomes against the approved order; Input: scenario root, command records, Protocol commands, version flag, field label, and error sink; Output: valid exit codes; Side effects: reads evidence and appends diagnostics."""
    if not isinstance(value, list) or not value:
        errors.append(f"{field}: expected non-empty list")
        return []
    if is_formal and (
        not isinstance(expected_commands, list) or len(value) != len(expected_commands)
    ):
        expected_length = len(expected_commands) if isinstance(expected_commands, list) else 0
        errors.append(
            f"{field}: must match protocol.commands length {expected_length}"
        )
    exit_codes: list[int] = []
    for index, item in enumerate(value):
        item_field = f"{field}[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{item_field}: expected object")
            continue
        command = item.get("command")
        if not _nonempty_string(command):
            errors.append(f"{item_field}.command: expected non-empty string")
        elif is_formal and isinstance(expected_commands, list) and index < len(
            expected_commands
        ):
            expected = expected_commands[index]
            if command != expected:
                errors.append(
                    f"{item_field}.command: does not match protocol.commands[{index}]"
                )
            executed = item.get("executedCommand")
            if not _nonempty_string(executed):
                errors.append(
                    f"{item_field}.executedCommand: expected non-empty string"
                )
            elif not _command_resolution_matches(expected, executed):
                errors.append(
                    f"{item_field}.executedCommand: must resolve protocol placeholders without changing the command"
                )
        exit_code = item.get("exitCode")
        if not isinstance(exit_code, int) or isinstance(exit_code, bool):
            errors.append(f"{item_field}.exitCode: expected integer")
        else:
            exit_codes.append(exit_code)
        _validate_evidence_list(
            scenario_dir, item.get("evidence"), f"{item_field}.evidence", errors
        )
    return exit_codes


def _validate_run_interaction(
    scenario_dir: Path,
    value: Any,
    protocol: dict[str, Any],
    original_request: str | None,
    field: str,
    errors: list[str],
) -> bool:
    """Purpose: validate the delivered transcript prefix and Implementer projection; Input: scenario, run interaction evidence, Protocol, original request, field label, and error sink; Output: true when every approved round was delivered in order; Side effects: reads evidence and appends diagnostics."""
    if not isinstance(value, dict):
        errors.append(f"{field}: expected object")
        return False
    expected_rounds = protocol.get("interaction", {}).get("rounds", [])
    observed_rounds = value.get("rounds")
    if not isinstance(observed_rounds, list) or not observed_rounds:
        errors.append(f"{field}.rounds: expected a non-empty delivered prefix")
        observed_rounds = []
    elif len(observed_rounds) > len(expected_rounds):
        errors.append(f"{field}.rounds: cannot exceed approved interaction rounds")

    for index, observed in enumerate(observed_rounds):
        item_field = f"{field}.rounds[{index}]"
        if index >= len(expected_rounds):
            break
        expected = expected_rounds[index]
        if not isinstance(observed, dict):
            errors.append(f"{item_field}: expected object")
            continue
        for key in ("sender", "contentRole"):
            if observed.get(key) != expected.get(key):
                errors.append(f"{item_field}.{key}: does not match approved round")
        message = original_request if index == 0 else expected.get("message")
        expected_message_hash = (
            hashlib.sha256(message.encode("utf-8")).hexdigest()
            if isinstance(message, str)
            else None
        )
        if observed.get("messageSha256") != expected_message_hash:
            errors.append(f"{item_field}.messageSha256: does not match approved message")
        prompt_hash = observed.get("promptSha256")
        if not isinstance(prompt_hash, str) or not HEX_SHA256.fullmatch(prompt_hash):
            errors.append(f"{item_field}.promptSha256: expected SHA-256")
        if observed.get("stopConditionObserved") is not True:
            errors.append(f"{item_field}.stopConditionObserved: expected true")
        expected_previous_stop = None if index == 0 else True
        if observed.get("deliveredAfterPreviousStop") is not expected_previous_stop:
            errors.append(
                f"{item_field}.deliveredAfterPreviousStop: expected {expected_previous_stop!r}"
            )
        _validate_evidence_list(
            scenario_dir,
            observed.get("evidence"),
            f"{item_field}.evidence",
            errors,
        )

    projection = value.get("promptProjection")
    projection_valid = isinstance(projection, dict)
    if not projection_valid:
        errors.append(f"{field}.promptProjection: expected object")
    else:
        for key in (
            "rawScenarioVisibleToImplementer",
            "rawProtocolVisibleToImplementer",
            "futureRoundsVisibleToImplementer",
        ):
            if projection.get(key) is not False:
                errors.append(f"{field}.promptProjection.{key}: expected false")
                projection_valid = False
        _validate_evidence_list(
            scenario_dir,
            projection.get("evidence"),
            f"{field}.promptProjection.evidence",
            errors,
        )
    return bool(
        projection_valid
        and isinstance(observed_rounds, list)
        and len(observed_rounds) == len(expected_rounds)
    )


def _validate_diff_evidence(
    scenario_dir: Path,
    value: Any,
    field: str,
    errors: list[str],
) -> None:
    """Purpose: require evidence for every Base-to-final Git state; Input: scenario root, diff evidence, field label, and error sink; Output: none; Side effects: reads evidence and appends diagnostics."""
    if not isinstance(value, dict):
        errors.append(f"{field}: expected object")
        return
    for state in sorted(DIFF_STATES):
        if state not in value:
            errors.append(f"{field}.{state}: missing Base-to-final evidence")
        else:
            _safe_evidence_file(
                scenario_dir, value[state], f"{field}.{state}", errors
            )


def _validate_quality_group(
    scenario_dir: Path,
    value: Any,
    dimensions: list[dict[str, Any]],
    minimum_total: int | float,
    field: str,
    errors: list[str],
) -> bool:
    """Purpose: validate one independently passing score group; Input: scenario, score object, rubric dimensions, minimum, field label, and error sink; Output: true when every score gate passes; Side effects: reads evidence and appends diagnostics."""
    if not isinstance(value, dict):
        errors.append(f"{field}: expected object")
        return False
    expected_ids = {
        dimension.get("id")
        for dimension in dimensions
        if isinstance(dimension, dict) and _nonempty_string(dimension.get("id"))
    }
    scores = value.get("scores")
    if not isinstance(scores, dict) or set(scores) != expected_ids:
        errors.append(f"{field}.scores: keys must match rubric dimensions")
        return False

    reasons = value.get("reasons")
    if not isinstance(reasons, dict) or set(reasons) != expected_ids:
        errors.append(f"{field}.reasons: keys must match rubric dimensions")
        reasons = {}
    else:
        for dimension_id, reason in reasons.items():
            if not _nonempty_string(reason):
                errors.append(
                    f"{field}.reasons.{dimension_id}: expected evidence-backed reason"
                )

    evidence = value.get("evidence")
    if not isinstance(evidence, dict) or set(evidence) != expected_ids:
        errors.append(f"{field}.evidence: keys must match rubric dimensions")
    else:
        for dimension_id, references in evidence.items():
            _validate_evidence_list(
                scenario_dir,
                references,
                f"{field}.evidence.{dimension_id}",
                errors,
            )

    values_valid = True
    weighted = 0.0
    critical_passed = True
    for dimension in dimensions:
        dimension_id = dimension["id"]
        score = scores.get(dimension_id)
        if not _number(score) or score not in RUBRIC_SCORE_VALUES:
            errors.append(
                f"{field}.scores.{dimension_id}: expected 0, 90, or 100"
            )
            values_valid = False
            continue
        weighted += score * dimension["weight"] / 100
        if dimension.get("critical") and score < dimension.get("minimum", 0):
            critical_passed = False
    total = value.get("totalScore")
    if not _number(total) or not 0 <= total <= 100:
        errors.append(f"{field}.totalScore: expected 0 to 100")
        values_valid = False
    elif values_valid and not math.isclose(total, weighted, abs_tol=0.01):
        errors.append(f"{field}.totalScore: does not match weights")
        values_valid = False
    return bool(values_valid and total >= minimum_total and critical_passed)


def _validate_quality_contract(
    scenario_dir: Path,
    value: Any,
    protocol: dict[str, Any],
    user_value_rubric: dict[str, Any] | None,
    field: str,
    errors: list[str],
) -> tuple[bool, bool]:
    """Purpose: validate behavior and user-value quality as separate gates; Input: scenario, quality object, Protocol, shared rubric, field label, and error sink; Output: behavior-pass and user-value-pass flags; Side effects: reads evidence and appends diagnostics."""
    if not isinstance(value, dict):
        errors.append(f"{field}: expected object")
        return False, False
    if set(value) != {"behavior", "userValue"}:
        errors.append(f"{field}: expected exactly behavior and userValue groups")
    behavior_rubric = protocol.get("rubric", {})
    behavior_passed = _validate_quality_group(
        scenario_dir,
        value.get("behavior"),
        behavior_rubric.get("dimensions", []),
        behavior_rubric.get("minimumTotal", 101),
        f"{field}.behavior",
        errors,
    )
    if not isinstance(user_value_rubric, dict):
        errors.append(f"{field}.userValue: shared rubric is unavailable")
        return behavior_passed, False
    user_value_passed = _validate_quality_group(
        scenario_dir,
        value.get("userValue"),
        user_value_rubric.get("dimensions", []),
        user_value_rubric.get("minimumTotal", 101),
        f"{field}.userValue",
        errors,
    )
    return behavior_passed, user_value_passed


def _validate_run_agents(
    value: Any,
    protocol: dict[str, Any],
    field: str,
    errors: list[str],
) -> None:
    """Purpose: bind Implementer and Reviewer identity to the approved Eval model; Input: run agents object, Protocol, field label, and error sink; Output: none; Side effects: appends diagnostics."""
    if not isinstance(value, dict):
        errors.append(f"{field}: expected object")
        return
    role_values: dict[str, dict[str, Any]] = {}
    expected_model = protocol.get("agents", {}).get("model")
    for role in ("implementer", "reviewer"):
        agent = value.get(role)
        role_field = f"{field}.{role}"
        if not isinstance(agent, dict):
            errors.append(f"{role_field}: expected object")
            continue
        role_values[role] = agent
        if not _nonempty_string(agent.get("id")):
            errors.append(f"{role_field}.id: expected non-empty string")
        if agent.get("forkTurns") != "none":
            errors.append(f"{role_field}.forkTurns: expected none")
        if agent.get("model") != expected_model:
            errors.append(f"{role_field}.model: does not match protocol.agents.model")
    if (
        "implementer" in role_values
        and "reviewer" in role_values
        and role_values["implementer"].get("id")
        == role_values["reviewer"].get("id")
    ):
        errors.append(f"{field}.reviewer.id: must differ from implementer")


def _validate_baseline(
    scenario_dir: Path,
    baseline: dict[str, Any],
    protocol: dict[str, Any],
    approval: dict[str, Any],
    current_hashes: dict[str, str],
    repo_root: Path,
    user_value_rubric: dict[str, Any] | None,
    original_request: str | None,
    errors: list[str],
) -> bool:
    """Purpose: validate a saved Baseline run; Input: scenario, Baseline, Protocol, approval, current hashes, shared rubric, original request, and error sink; Output: true only for a valid red-result claim; Side effects: reads evidence and appends diagnostics."""
    _validate_hash_bindings(baseline, current_hashes, "baseline", errors)
    protocol_version = protocol.get("protocolVersion")
    frozen_v2 = _is_frozen_v2_run(
        scenario_dir,
        protocol,
        repo_root,
        "baseline",
        FROZEN_V2_BASELINES,
        errors,
    )
    if protocol_version == 2 and not frozen_v2:
        errors.append(
            "baseline: Protocol v2 permits only registered frozen historical evidence"
        )
    if baseline.get("proposalId") != approval.get("proposalId"):
        errors.append("baseline.proposalId: does not match approval")

    target_skills = protocol.get("targetSkills", [])
    snapshots = baseline.get("baselineSkillSnapshots")
    if not isinstance(snapshots, dict) or set(snapshots) != set(target_skills):
        errors.append(
            "baseline.baselineSkillSnapshots: keys must exactly match targetSkills"
        )
    else:
        expectations = protocol.get("skillExpectations", {})
        for skill in target_skills:
            snapshot = snapshots.get(skill)
            field = f"baseline.baselineSkillSnapshots.{skill}"
            if not isinstance(snapshot, dict):
                errors.append(f"{field}: expected object")
                continue
            expectation = expectations.get(skill, {})
            expected_status = (
                expectation.get("baselineLoad")
                if protocol.get("protocolVersion") in FORMAL_PROTOCOL_MODELS
                else expectation.get("load")
            )
            status_value = snapshot.get("status")
            if status_value != expected_status:
                errors.append(f"{field}.status: does not match protocol load")
            snapshot_hash = snapshot.get("sha256")
            if status_value == "absent":
                if snapshot_hash is not None:
                    errors.append(f"{field}.sha256: absent snapshot must use null")
            elif not isinstance(snapshot_hash, str) or not HEX_SHA256.fullmatch(
                snapshot_hash
            ):
                errors.append(f"{field}.sha256: explicit snapshot requires SHA-256")

    environment = baseline.get("environment")
    if not isinstance(environment, dict):
        errors.append("baseline.environment: expected object")
    else:
        if environment.get("passed") is not True:
            errors.append("baseline.environment.passed: expected true")
        commit = environment.get("fixtureBaseCommit")
        if not isinstance(commit, str) or not GIT_COMMIT.fullmatch(commit):
            errors.append("baseline.environment.fixtureBaseCommit: expected Git commit")
        _validate_checks(
            scenario_dir,
            environment.get("checks"),
            "baseline.environment.checks",
            errors,
            require_all_passed=True,
        )

    gate_results = _validate_checks(
        scenario_dir, baseline.get("hardGates"), "baseline.hardGates", errors
    )
    exit_codes = _validate_commands(
        scenario_dir,
        baseline.get("commands"),
        protocol.get("commands"),
        protocol.get("protocolVersion") in FORMAL_PROTOCOL_MODELS,
        "baseline.commands",
        errors,
    )
    _validate_diff_evidence(
        scenario_dir, baseline.get("diffEvidence"), "baseline.diffEvidence", errors
    )

    is_formal = protocol.get("protocolVersion") in FORMAL_PROTOCOL_MODELS
    behavior_quality_passed = True
    user_value_passed = True
    interaction_complete = True
    if is_formal:
        if "timing" in baseline:
            errors.append(
                "baseline.timing: wall-clock quality fields are not allowed in formal Protocols"
            )
        interaction_complete = _validate_run_interaction(
            scenario_dir,
            baseline.get("interaction"),
            protocol,
            original_request,
            "baseline.interaction",
            errors,
        )
        behavior_quality_passed, user_value_passed = _validate_quality_contract(
            scenario_dir,
            baseline.get("quality"),
            protocol,
            user_value_rubric,
            "baseline.quality",
            errors,
        )
        _validate_run_agents(
            baseline.get("agents"), protocol, "baseline.agents", errors
        )

    gates_passed = bool(gate_results) and all(gate_results)
    commands_passed = bool(exit_codes) and all(code == 0 for code in exit_codes)
    behavior_passed = (
        gates_passed
        and commands_passed
        and behavior_quality_passed
        and interaction_complete
    )
    observed_pass = behavior_passed and user_value_passed

    result = baseline.get("result")
    if result not in {"fail", "control-pass"}:
        errors.append("baseline.result: expected fail or control-pass")
        return False
    if not _nonempty_string(baseline.get("summary")):
        errors.append("baseline.summary: expected non-empty string")
    if result == "fail":
        failure_kind = baseline.get("failureKind")
        if failure_kind not in {"skill-behavior", "skill-user-value"}:
            errors.append(
                "baseline.failureKind: expected skill-behavior or skill-user-value"
            )
        elif failure_kind == "skill-behavior" and behavior_passed:
            errors.append(
                "baseline.failureKind: skill-behavior requires a failed gate, command, or behavior score"
            )
        elif failure_kind == "skill-user-value" and user_value_passed:
            errors.append(
                "baseline.failureKind: skill-user-value requires a failed user-value score"
            )
        if observed_pass:
            errors.append(
                "baseline.result: fail contradicts all-green behavior and user-value evidence"
            )
    else:
        if not observed_pass:
            errors.append(
                "baseline.result: control-pass requires green behavior and user-value evidence"
            )
        if baseline.get("failureKind") is not None:
            errors.append("baseline.failureKind: control-pass must use null")
    return result == "fail"


def _is_frozen_v2_run(
    scenario_dir: Path,
    protocol: dict[str, Any],
    repo_root: Path,
    run_name: str,
    frozen_records: dict[str, dict[str, str]],
    errors: list[str],
) -> bool:
    """Purpose: identify one immutable v2 run record; Input: scenario, Protocol, repository root, run name, frozen registry, and error sink; Output: true only for registered bytes; Side effects: hashes saved evidence and appends tamper diagnostics."""
    try:
        relative_dir = scenario_dir.relative_to(repo_root).as_posix()
    except ValueError:
        return False
    frozen = frozen_records.get(relative_dir)
    if frozen is None:
        return False
    if protocol.get("protocolVersion") != 2:
        errors.append(f"{run_name}: frozen v2 registry requires protocolVersion 2")
        return False
    try:
        protocol_hash = sha256_file(scenario_dir / "protocol.json")
        run_hash = sha256_file(scenario_dir / f"{run_name}.json")
    except ContractError as error:
        errors.append(f"{run_name}: cannot hash frozen v2 evidence: {error}")
        return False
    if protocol_hash != frozen["protocolSha256"]:
        errors.append(f"{run_name}: frozen v2 protocol hash mismatch")
        return False
    if run_hash != frozen[f"{run_name}Sha256"]:
        errors.append(f"{run_name}: frozen v2 {run_name} hash mismatch")
        return False
    return True


def _validate_scorecard(
    scenario_dir: Path,
    scorecard: dict[str, Any],
    protocol: dict[str, Any],
    approval: dict[str, Any],
    current_hashes: dict[str, str],
    repo_root: Path,
    user_value_rubric: dict[str, Any] | None,
    original_request: str | None,
    errors: list[str],
) -> tuple[bool, bool]:
    """Purpose: validate a saved Live Eval scorecard; Input: scenario, scorecard, contracts, repository root, shared rubric, original request, and error sink; Output: observed-pass and user-accepted flags; Side effects: reads Skills/evidence and appends diagnostics."""
    _validate_hash_bindings(scorecard, current_hashes, "scorecard", errors)
    if scorecard.get("proposalId") != approval.get("proposalId"):
        errors.append("scorecard.proposalId: does not match approval")

    target_skills = protocol.get("targetSkills", [])
    sources = protocol.get("skillSources", {})
    protocol_version = protocol.get("protocolVersion")
    frozen_v2 = _is_frozen_v2_run(
        scenario_dir,
        protocol,
        repo_root,
        "scorecard",
        FROZEN_V2_SCORECARDS,
        errors,
    )
    if protocol_version == 2 and not frozen_v2:
        errors.append(
            "scorecard: Protocol v2 permits only registered frozen historical evidence"
        )
    snapshots = scorecard.get("skillSnapshots")
    if not isinstance(snapshots, dict) or set(snapshots) != set(target_skills):
        errors.append("scorecard.skillSnapshots: keys must exactly match targetSkills")
    else:
        for skill in target_skills:
            snapshot = snapshots.get(skill)
            field = f"scorecard.skillSnapshots.{skill}"
            if not isinstance(snapshot, dict):
                errors.append(f"{field}: expected object")
                continue
            expected_status = protocol.get("skillExpectations", {}).get(skill, {}).get(
                "liveLoad"
            )
            if snapshot.get("status") != expected_status:
                errors.append(f"{field}.status: does not match protocol liveLoad")
            if frozen_v2:
                snapshot_hash = snapshot.get("sha256")
                if not isinstance(snapshot_hash, str) or not HEX_SHA256.fullmatch(
                    snapshot_hash
                ):
                    errors.append(
                        f"{field}.sha256: frozen v2 snapshot requires SHA-256"
                    )
            else:
                source = sources.get(skill)
                try:
                    expected_hash = sha256_tree(repo_root / source)
                except (ContractError, TypeError) as error:
                    errors.append(f"{field}.sha256: cannot hash current skill: {error}")
                else:
                    if snapshot.get("sha256") != expected_hash:
                        errors.append(f"{field}.sha256: does not match current skill")

    _validate_run_agents(
        scorecard.get("agents"), protocol, "scorecard.agents", errors
    )

    gate_results = _validate_checks(
        scenario_dir, scorecard.get("hardGates"), "scorecard.hardGates", errors
    )
    exit_codes = _validate_commands(
        scenario_dir,
        scorecard.get("commands"),
        protocol.get("commands"),
        protocol.get("protocolVersion") in FORMAL_PROTOCOL_MODELS,
        "scorecard.commands",
        errors,
    )
    _validate_diff_evidence(
        scenario_dir, scorecard.get("diffEvidence"), "scorecard.diffEvidence", errors
    )
    interaction_complete = _validate_run_interaction(
        scenario_dir,
        scorecard.get("interaction"),
        protocol,
        original_request,
        "scorecard.interaction",
        errors,
    )

    behavior_quality_passed, user_value_passed = _validate_quality_contract(
        scenario_dir,
        scorecard.get("quality"),
        protocol,
        user_value_rubric,
        "scorecard.quality",
        errors,
    )
    if "timing" in scorecard:
        errors.append(
            "scorecard.timing: wall-clock quality fields are not allowed in formal Protocols"
        )

    gates_passed = bool(gate_results) and all(gate_results)
    commands_passed = bool(exit_codes) and all(code == 0 for code in exit_codes)
    observed_pass = (
        gates_passed
        and commands_passed
        and behavior_quality_passed
        and user_value_passed
        and interaction_complete
    )
    result = scorecard.get("result")
    if result not in {"pass", "fail"}:
        errors.append("scorecard.result: expected pass or fail")
    elif result == "pass" and not observed_pass:
        errors.append(
            "scorecard.result: pass contradicts behavior or user-value evidence"
        )
    elif result == "fail" and observed_pass:
        errors.append("scorecard.result: fail contradicts all-green evidence")

    user_decision = scorecard.get("userDecision")
    if user_decision not in {"pending", "accepted", "rejected"}:
        errors.append("scorecard.userDecision: invalid value")
    if user_decision == "accepted" and result != "pass":
        errors.append("scorecard.userDecision: failed run cannot be accepted")
    return result == "pass" and observed_pass, user_decision == "accepted"


def validate_scenario_dir(
    scenario_dir: str | Path,
    repo_root: str | Path | None = None,
) -> ScenarioResult:
    """Purpose: validate one saved Eval scenario without running agents; Input: scenario directory and optional repository root; Output: independent ScenarioResult stage facts; Side effects: reads Proposal and evidence files."""

    directory = Path(scenario_dir).resolve()
    repository = Path(repo_root).resolve() if repo_root is not None else directory.parents[2]
    errors: list[str] = []
    protocol_errors: list[str] = []
    approval_errors: list[str] = []
    baseline_errors: list[str] = []
    scorecard_errors: list[str] = []

    protocol = _load_json(directory / "protocol.json", protocol_errors, "protocol")
    user_value_rubric: dict[str, Any] | None = None
    original_request = _scenario_original_user_request(
        directory / "scenario.md", protocol_errors
    )
    if protocol is not None:
        user_value_rubric = _validate_protocol(
            protocol,
            repository,
            protocol_errors,
        )
        if protocol.get("scenarioId") != directory.name:
            protocol_errors.append(
                "protocol.scenarioId: must match scenario directory name"
            )
        if original_request is not None:
            for index, round_spec in enumerate(
                protocol.get("interaction", {}).get("rounds", [])[1:], start=1
            ):
                if (
                    isinstance(round_spec, dict)
                    and _nonempty_string(round_spec.get("message"))
                    and round_spec["message"] in original_request
                ):
                    protocol_errors.append(
                        f"protocol.interaction.rounds[{index}].message: future reply leaks into original request"
                    )

    _validate_fixture_runtime_artifacts(directory / "fixture", protocol_errors)
    current_hashes = _current_input_hashes(directory, approval_errors)
    approval = _load_json(
        directory / "proposal-approval.json", approval_errors, "approval"
    )
    if approval is not None:
        _validate_approval(approval, current_hashes, approval_errors)

    baseline_path = directory / "baseline.json"
    scorecard_path = directory / "scorecard.json"
    if protocol is not None and protocol.get("protocolVersion") == 1:
        if not baseline_path.exists():
            protocol_errors.append(
                "protocol.protocolVersion: v1 is allowed only for a saved historical Baseline"
            )
        if scorecard_path.exists():
            protocol_errors.append(
                "protocol.protocolVersion: v1 historical records cannot add a Scorecard"
            )
    baseline: dict[str, Any] | None = None
    baseline_result_is_red = False
    if baseline_path.exists():
        baseline = _load_json(baseline_path, baseline_errors, "baseline")
        if approval is None or approval.get("decision") != "approved":
            baseline_errors.append("baseline: requires an approved Proposal")
        if baseline is not None and protocol is not None and approval is not None:
            baseline_result_is_red = _validate_baseline(
                directory,
                baseline,
                protocol,
                approval,
                current_hashes,
                repository,
                user_value_rubric,
                original_request,
                baseline_errors,
            )

    scorecard: dict[str, Any] | None = None
    scorecard_result_passed = False
    scorecard_user_accepted = False
    if scorecard_path.exists():
        scorecard = _load_json(scorecard_path, scorecard_errors, "scorecard")
        if baseline is None:
            scorecard_errors.append("scorecard: requires Baseline")
        elif baseline.get("result") == "control-pass":
            scorecard_errors.append("scorecard: control-pass must stop before Live Eval")
        if scorecard is not None and protocol is not None and approval is not None:
            scorecard_result_passed, scorecard_user_accepted = _validate_scorecard(
                directory,
                scorecard,
                protocol,
                approval,
                current_hashes,
                repository,
                user_value_rubric,
                original_request,
                scorecard_errors,
            )

    errors.extend(protocol_errors)
    errors.extend(approval_errors)
    errors.extend(baseline_errors)
    errors.extend(scorecard_errors)
    base_valid = not (protocol_errors or approval_errors or baseline_errors)
    baseline_red = bool(baseline) and base_valid and baseline_result_is_red
    evaluation_passed = (
        baseline_red and not scorecard_errors and scorecard_result_passed
    )
    user_accepted = evaluation_passed and scorecard_user_accepted
    protocol = protocol or {}
    return ScenarioResult(
        scenario_dir=directory,
        scenario_id=protocol.get("scenarioId"),
        case_id=protocol.get("caseId"),
        project_id=protocol.get("projectId"),
        primary_skill=protocol.get("primarySkill"),
        counts_toward_product_skill=protocol.get(
            "countsTowardProductSkill"
        ) is True,
        contract_valid=not errors,
        baseline_red=baseline_red,
        evaluation_passed=evaluation_passed,
        user_accepted=user_accepted,
        errors=tuple(errors),
    )


def validate_all_scenarios(
    eval_root: str | Path,
    repo_root: str | Path | None = None,
) -> list[ScenarioResult]:
    """Purpose: validate all saved scenarios and reject duplicate identities; Input: Eval root and optional repository root; Output: ordered ScenarioResult list; Side effects: reads scenario directories."""

    root = Path(eval_root)
    if not root.exists():
        return []
    directories = sorted(
        (
            path
            for path in root.iterdir()
            if path.is_dir()
            and ((path / "scenario.md").exists() or (path / "protocol.json").exists())
        ),
        key=lambda path: path.name,
    )
    results = [validate_scenario_dir(path, repo_root) for path in directories]
    scenario_owners: dict[str, list[int]] = {}
    case_owners: dict[str, list[int]] = {}
    for index, result in enumerate(results):
        if result.scenario_id:
            scenario_owners.setdefault(result.scenario_id, []).append(index)
        if result.case_id:
            case_owners.setdefault(result.case_id, []).append(index)

    extra_errors: dict[int, list[str]] = {}
    for label, owners in (("scenarioId", scenario_owners), ("caseId", case_owners)):
        for value, indexes in owners.items():
            if len(indexes) > 1:
                for index in indexes:
                    extra_errors.setdefault(index, []).append(
                        f"duplicate {label}: {value}"
                    )
    for index, additions in extra_errors.items():
        result = results[index]
        results[index] = replace(
            result,
            contract_valid=False,
            evaluation_passed=False,
            user_accepted=False,
            errors=result.errors + tuple(additions),
        )
    return results


def accepted_case_coverage(
    eval_root: str | Path,
    repo_root: str | Path | None = None,
) -> dict[str, dict[str, list[str]]]:
    """Purpose: summarize accepted product-Skill coverage without E2E controls; Input: Eval root and optional repository root; Output: case and project IDs by Skill; Side effects: reads scenario directories."""

    coverage: dict[str, dict[str, set[str]]] = {}
    for result in validate_all_scenarios(eval_root, repo_root):
        if not (
            result.contract_valid
            and result.baseline_red
            and result.evaluation_passed
            and result.user_accepted
            and result.counts_toward_product_skill
            and result.primary_skill
            and result.case_id
            and result.project_id
        ):
            continue
        skill = coverage.setdefault(
            result.primary_skill, {"caseIds": set(), "projectIds": set()}
        )
        skill["caseIds"].add(result.case_id)
        skill["projectIds"].add(result.project_id)
    return {
        skill: {
            "caseIds": sorted(values["caseIds"]),
            "projectIds": sorted(values["projectIds"]),
        }
        for skill, values in sorted(coverage.items())
    }
