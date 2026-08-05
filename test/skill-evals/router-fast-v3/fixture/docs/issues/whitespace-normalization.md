# Whitespace Normalization Bug

Search summaries receive text copied from HTML pages. The caller expects every run of whitespace, including spaces, tabs, and line breaks, to become one ASCII space. The current public entry point and return type must remain unchanged.

Reproduction input:

```text
"alpha   beta\n\tgamma"
```

Expected output:

```text
"alpha beta gamma"
```
