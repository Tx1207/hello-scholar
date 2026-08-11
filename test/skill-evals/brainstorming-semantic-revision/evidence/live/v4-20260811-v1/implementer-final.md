已完成自审并停止：

- 已将精确审核通过的 Revision 3 写入 `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v1-20260811a/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`。
- 仅该 Spec 发生修改；源代码、测试、Architecture、`SPEC-004`、Plan、Tasks、Runs 和 Skill 文件均未修改。
- `python3 -m unittest discover ...`：2/2 测试通过。
- `git diff --check`：通过。
- `hello-scholar docs check`：errors 0，但两个生成 Index 当前为 stale，因为 `hello-scholar docs sync` 被本地自动权限策略拒绝，未手工编辑 Index。
- 测试产生的 `/tmp/.../src/__pycache__/` 与 `/tmp/.../tests/__pycache__/` 未跟踪目录也无法由当前权限策略删除；未将其纳入任何提交或其他变更。

result: 已写入审核通过的 SPEC-001 Revision 3，测试与 diff 自审通过；Index 刷新因 CLI 权限拒绝而保持 stale，且未绕过策略手工修改。
