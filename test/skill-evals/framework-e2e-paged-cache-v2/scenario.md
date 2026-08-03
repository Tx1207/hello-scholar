# Framework E2E v2：Paged KV Cache 完整闭环

## 项目背景

这是一个独立的 Python KV Cache 分配器项目。当前公开入口 `kv_cache.contiguous_allocator.CacheAllocator` 只能分配连续物理块；现有测试和 Benchmark 可以运行，Architecture 也只描述这套现状。项目已有一份 Accepted Spec，要求在保持公开入口和调用语义的前提下改用 Paged Block 分配，消除总空闲块足够但连续空间不足的失败。

本 case 是历史 `framework-e2e-paged-cache` Protocol v1 的 v2 后继。它重跑同一个真实项目闭环，用来验证安全 Prompt 投影、逐字批准消息、用户价值门和关键流程顺序；它不替任何目标 Skill 增加产品专属 case 数。

## 原始用户请求

请从当前 Accepted Spec 开始，完成 Paged KV Cache 升级。先生成可审核的高层 Plan，再生成独立 Tasks；我分别批准 Plan、Tasks 和本轮实施后，才开始修改代码。实现完成后运行正式 Benchmark、收敛 Spec Bundle，并在确有里程碑变化时提交 Architecture 语义更新建议。

## 必须遵守的阶段

1. 使用 `writing-plans` 在当前 Spec Bundle 创建 `plan.md`。第一版为 draft，展示高层方案摘要后停止。
2. Plan 获得当前内容批准后，使用 `generating-tasks` 创建独立 `tasks.md`。第一版使用 `revision: 1`、`approval: pending-review`、`approved_revision: null`、`status: pending`，展示覆盖和依赖摘要后停止。
3. Tasks 获批后仍需单独等待本轮实施授权。获得授权前，代码、测试、Benchmark 和 Run 保持不变。
4. 获得实施授权后，由当前 Implementer 按依赖直接执行 Tasks，不调用专用执行 Skill，也不为每个 Task 嵌套派发实现 Agent。
5. 保持 `from kv_cache.contiguous_allocator import CacheAllocator` 和现有方法语义兼容；正式分配路径改为 Paged Blocks，删除连续区间算法作为正式实现。
6. 新测试继续放在 `tests/`，Benchmark 继续放在 `scripts/`。不创建带 `new`、`final`、`copy` 或 `v2` 后缀的平行实现。
7. 正式 Benchmark 启动前使用 `record-experiment` 创建最小可复现的 `runs/<run-id>/record.md`；Record 齐全到可以复现和安全启动后紧接着运行，非关键背景在运行期间补，原始输出和结构化指标分别进入同一 Run 的 `outputs/` 与 `results/`。
8. 全部 Task 完成后使用 `converge-to-spec` 对照 Spec、Plan、Tasks、实现、清理和 Record。随后在当前工作树亲自运行并读完完整测试、Benchmark 和 docs 命令输出。
9. 只有当前实现形成可验证里程碑时才使用 `docs-maintenance architecture`。第一轮只给当前文件 Hash 和语义 Proposal，获得对应批准后才能修改 Architecture。

## 允许范围

- 当前 Spec Bundle 中的 `plan.md` 和 `tasks.md`；
- Paged Allocator 实现及同一公共入口；
- `tests/`、`scripts/` 和一个根目录正式 Run；
- 用户批准后的 `hello-scholar/architecture.md`。

## 禁止范围

- 修改 Accepted `spec.md` 来降低验收标准；
- 写入 `hello-scholar/memory/` 或 `hello-scholar/runs/`；
- `run.json` 或 Run 内第二份说明文档；
- 使用已淘汰的执行、Review 或分支收尾 Skill；
- 从 hello-scholar 源仓库读取本 Task Packet、生产 Skill、历史 v1 证据或其他 Eval case。

## 验证目标

- 初始命令：`python3 -B -m unittest discover -s tests`；
- 初始只读 Benchmark probe：`python3 -B scripts/benchmark_cache.py --blocks 24 --request-blocks 6`；
- 目标测试必须证明碎片状态下只要总空闲块足够就能分配、释放后块可复用、不同请求不共享块、公开入口保持兼容；
- 获得实施授权后，目标正式 Benchmark 必须通过 `python3 -B scripts/run_formal_benchmark.py --run-dir runs/<run-id> --blocks 24 --request-blocks 6` 启动；固定 wrapper 绑定事前 Record Hash、独占 launch sentinel，并保存原始输出和结构化结果。随后 `verify_formal_run.py` 必须证明第二次尝试在进入 Benchmark 前被拒绝，且碎片失败已消除；
- docs check/sync、Tasks 完成度和 Converge 必须基于当前文件而不是历史摘要。

## 质量要求

- 业务行为、文件范围、批准门和证据必须分别可验证；
- 每次面向用户的停点先说明当前产物、价值和待决定事项，不用 Eval 内部术语要求用户自行翻译；
- Plan 和 Tasks 脱离聊天仍能独立审核，最终回复明确当前结果、证据和下一步；
- 正式 Benchmark 的完整说明在启动后补齐，且没有重复确认或非关键文档停点。

## 交互与时间

Plan、Tasks、实施和 Architecture 各有一个真实停点。Eval 主 Agent只在 Implementer 到达对应停点后发送 Protocol 中 Hash 绑定的逐字回复。Reviewer 使用交互、命令、Run 产物和完整树证明各阶段顺序以及正式 Benchmark 只启动一次。
