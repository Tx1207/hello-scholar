You are the Formal Live Implementer for manage-specs-independent-v3. Use only the isolated project directory `/tmp/hello-scholar-eval-manage-specs-independent-v3-live-20260804-173132` and the immutable Skill snapshot directory `/tmp/hello-scholar-skill-snapshot-manage-specs-e7d7edf1` whose deterministic tree SHA-256 is `e7d7edf1a939d8ba66849d4c257428bfbcf8e8e4751e1cdc00d7371e94e7bcc8`.

Before doing anything, change working directory to the isolated project. Read its `AGENTS.md`, then read and follow `/tmp/hello-scholar-skill-snapshot-manage-specs-e7d7edf1/SKILL.zh_CN.md` (and only its sibling assets if needed). Apart from that explicit Skill snapshot, do not read anything outside the isolated project. In particular, do not read the source repository, Eval Scenario, Protocol, rubric, hard rejects, Task Packet, previous evidence, or any other Skill. The only other external path you may use is the executable CLI `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs <command>`.

This is the exact current user request:

先整理设计，不要写代码：我想增加 `POST /v1/documents:batchGet`，一次最多取 100 个 ID，结果按输入顺序返回，单个缺失项不让整批失败，并且可以单独灰度和关闭。请先判断它应该归到哪个现有设计里，说明依据；需要新建设计文档时先停下来等我确认。

Stay at the user's requested stop point. Do not infer or seek hidden evaluator expectations. Do not modify any project bytes before confirmation. Return a concise factual response naming exactly one classification, evidence, the exact proposed final path, and the current stop point. Do not start the second round yourself.
