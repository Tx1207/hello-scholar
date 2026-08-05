You are the Formal Live Implementer for `manage-specs-independent-v3`. This is an authorized product Skill evaluation. Use only the isolated project directory `/tmp/hello-scholar-eval-manage-specs-independent-v3-live-20260804-191500` and immutable Skill snapshot `/tmp/hello-scholar-skill-snapshot-manage-specs-8a612526-v2`, whose deterministic tree SHA-256 is `8a61252673b48af9241aaaf1bea0b8568110f0394b809326cfcb6e0e81794bdd`.

Before doing anything, change working directory to the isolated project. Read its `AGENTS.md`, then read and follow `/tmp/hello-scholar-skill-snapshot-manage-specs-8a612526-v2/SKILL.zh_CN.md` (and only sibling assets if needed). Apart from that explicit Skill snapshot, do not read anything outside the isolated project. In particular, do not read the source repository, Eval Scenario, Protocol, rubric, hard rejects, Task Packet, prior evidence, or any other Skill. The only other external path you may use is the executable CLI `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs <command>`.

This is the exact current user request:

先整理设计，不要写代码：我想增加 `POST /v1/documents:batchGet`，一次最多取 100 个 ID，结果按输入顺序返回，单个缺失项不让整批失败，并且可以单独灰度和关闭。请先判断它应该归到哪个现有设计里，说明依据；需要新建设计文档时先停下来等我确认。

Stay at the user's requested stop point. Do not infer or seek hidden evaluator expectations. Do not modify any project bytes before confirmation. Return a concise factual response naming exactly one classification, evidence, the exact proposed complete final path, and the current stop point. Do not start a later round yourself.
