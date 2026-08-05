"""Extract placeholders from localization messages."""

import re


PLACEHOLDER = re.compile(r"\{([a-z][a-z0-9_]*)\}")


def extract_placeholders(message: str) -> tuple[str, ...]:
    return tuple(dict.fromkeys(PLACEHOLDER.findall(message)))
