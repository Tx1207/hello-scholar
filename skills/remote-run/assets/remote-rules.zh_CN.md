## 远程执行

- 代码在本地修改，在 `<别名>` 上运行。只通过 `scripts/remote/*.sh` 访问服务器，不要直接 `ssh`，也不要在服务器上改代码：同步会用 Git 部署本地的提交或工作区内容。
- 同步因第一次同步预演而停下时，把预演结果给用户看，用户同意后才加 `--confirm-first-sync`。同步因服务器文件被修改、或与提交内容不同而停下时，把列出的文件给用户看，不要绕过。
- 要删除代码，就在本地删除，下次同步时服务器上会相应删除。服务器上未跟踪的残留文件只用 `scripts/remote/delete.sh <路径>` 删除，每次一个路径，且只删用户同意的路径。不要通过 `run.sh` 或代码删除、移动服务器上的文件；权重、数据和 Run 产物由用户在服务器上自行删除。
- 预计 5 分钟内结束的任务，例如单元测试、小规模调试和数据检查：`scripts/remote/run.sh <命令>`。
- 训练、评测以及任何可能更久的任务：`scripts/remote/run.sh --bg --name <任务名> <命令>`。正式 Run 先建 planned Record，用 `--run <run-id> --startup` 跑启动检查（可反复运行，日志在该 Run 中记为 `startup-NN`），再按项目的提交说明规则提交待提交的改动，用 `--bg --run <run-id>` 启动唯一一次正式执行；代码有未提交改动时 `run.sh` 会拒绝正式执行。
- 用 `scripts/remote/logs.sh <任务名>` 查看进度，间隔与任务预计时长相称，不要高频轮询。
- 任务日志中 `[exit N ...]` 的 N 不为 0 表示失败：读 stderr 并修复原因。启动检查直接重跑即可。正式执行失败时，这个 Run 以 `failed` 关闭；获得授权后重跑另建新 Run，`derived_from` 指向它，并从已完成的阶段继续。
- 写入 Record 前，用 `scripts/remote/pull.sh <run-id>` 把 `runs/<run-id>/results/` 中的小结果拉回本地。`runs/<run-id>/logs/` 中的日志和 `artifacts/<run-id>/` 中的 checkpoint 留在服务器上，Record 以 `<别名>:<路径>` 引用它们，并保留启动任务时 `run.sh` 的输出。
- 长任务运行期间，不要修改它还会读取的文件，例如它的配置或结束时调用的评测脚本；需要改时复制成新文件再改。
- 停止任务：`scripts/remote/stop.sh <任务名>`。
- 不要读取或打印只在服务器上的目录（`scripts/remote/remote.env` 中 `REMOTE_SERVER_DIRS` 列出的目录，例如 `data/`）中的原始数据；打印出来的内容都会发给模型厂商。
