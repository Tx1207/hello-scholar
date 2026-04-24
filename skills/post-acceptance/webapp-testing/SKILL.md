---
name: webapp-testing
description: 使用 Playwright 与本地 Web 应用交互并进行测试的工具包。支持验证前端功能、调试 UI 行为、抓取浏览器截图以及查看浏览器日志。
license: Complete terms in LICENSE.txt
version: 0.1.0
---

# Web 应用测试

测试本地 Web 应用时，编写原生 Python Playwright 脚本。

**可用辅助脚本：**
- `scripts/with_server.py` - 管理 server 生命周期（支持多个 server）

**始终先用 `--help` 运行脚本** 查看用法。不要在未尝试运行前就去读源码，除非你已经确认确实需要定制化方案。这些脚本可能很大，会污染上下文窗口。它们存在的意义是作为黑盒脚本被直接调用，而不是整体读入上下文。

## 决策树：如何选择方案

```text
User task -> Is it static HTML?
    |- Yes -> 直接读取 HTML 文件，识别 selectors
    |        |- Success -> 用这些 selectors 写 Playwright 脚本
    |        \- Fails/Incomplete -> 按动态页面处理（见下）
    |
    \- No (dynamic webapp) -> Is the server already running?
        |- No -> Run: python scripts/with_server.py --help
        |       然后使用 helper + 编写简化 Playwright 脚本
        |
        \- Yes -> Reconnaissance-then-action:
            1. Navigate 并等待 networkidle
            2. 截图或检查 DOM
            3. 从渲染状态识别 selectors
            4. 使用已发现 selectors 执行动作
```

## 示例：使用 `with_server.py`

启动 server 时，先运行 `--help`，再使用 helper：

**单个 server：**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**多个 servers（例如 backend + frontend）：**
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

创建自动化脚本时，只包含 Playwright 逻辑（servers 会自动管理）：
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173') # Server already running and ready
    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute
    # ... your automation logic
    browser.close()
```

## Reconnaissance-Then-Action 模式

1. **检查渲染后的 DOM**：
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```

2. 从检查结果中识别 selectors

3. 使用已发现 selectors 执行动作

## 常见陷阱

`Don't`：在动态应用中，等待 `networkidle` 之前就检查 DOM  
`Do`：先执行 `page.wait_for_load_state('networkidle')`，再进行检查

## 最佳实践

- **把 bundled scripts 当黑盒用**：为完成任务，先判断 `scripts/` 里的脚本是否已经能帮你完成。它们能可靠处理常见复杂流程，同时不污染上下文。先看 `--help`，然后直接调用。
- 对同步脚本使用 `sync_playwright()`
- 完成后始终关闭浏览器
- 使用具描述性的 selectors：`text=`、`role=`、CSS selectors 或 IDs
- 添加合适等待：`page.wait_for_selector()` 或 `page.wait_for_timeout()`

## 参考文件

- **examples/** - 展示常见模式的示例：
  - `element_discovery.py` - 发现页面上的按钮、链接和输入框
  - `static_html_automation.py` - 使用 `file://` URLs 处理本地 HTML
  - `console_logging.py` - 在自动化过程中抓取 console logs
