# 进阶插件示例

这是一个带 MCP 集成和复杂组织结构的企业级插件示例。

## 目录结构

```
enterprise-devops/
├── .claude-plugin/plugin.json
├── commands/
│   ├── ci/build.md
│   ├── ci/test.md
│   ├── ci/deploy.md
│   ├── monitoring/status.md
│   ├── monitoring/logs.md
│   ├── admin/configure.md
│   └── admin/manage.md
├── agents/
│   ├── orchestration/deployment-orchestrator.md
│   ├── orchestration/rollback-manager.md
│   ├── specialized/kubernetes-expert.md
│   ├── specialized/terraform-expert.md
│   └── specialized/security-auditor.md
├── skills/
│   ├── kubernetes-ops/
│   ├── terraform-iac/
│   └── ci-cd-pipelines/
├── hooks/
│   ├── hooks.json
│   └── scripts/
├── .mcp.json
├── servers/
│   ├── kubernetes-mcp/
│   ├── terraform-mcp/
│   └── github-actions-mcp/
├── lib/
│   ├── core/
│   ├── integrations/
│   └── utils/
└── config/
    ├── environments/
    └── templates/
```

## 核心文件

### .claude-plugin/plugin.json

```json
{
  "name": "enterprise-devops",
  "version": "2.3.1",
  "description": "面向企业 CI/CD、基础设施管理和监控的综合 DevOps 自动化插件",
  "author": {
    "name": "DevOps Platform Team",
    "email": "devops-platform@company.com",
    "url": "https://company.com/teams/devops"
  },
  "homepage": "https://docs.company.com/plugins/devops",
  "repository": {
    "type": "git",
    "url": "https://github.com/company/devops-plugin.git"
  },
  "license": "Apache-2.0",
  "keywords": ["devops", "ci-cd", "kubernetes", "terraform", "automation", "infrastructure", "deployment", "monitoring"],
  "commands": ["./commands/ci", "./commands/monitoring", "./commands/admin"],
  "agents": ["./agents/orchestration", "./agents/specialized"],
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

### .mcp.json

```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/kubernetes-mcp/index.js"],
      "env": {
        "KUBECONFIG": "${KUBECONFIG}",
        "K8S_NAMESPACE": "${K8S_NAMESPACE:-default}"
      }
    },
    "terraform": {
      "command": "python",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/terraform-mcp/main.py"],
      "env": {
        "TF_STATE_BUCKET": "${TF_STATE_BUCKET}",
        "AWS_REGION": "${AWS_REGION}"
      }
    },
    "github-actions": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/github-actions-mcp/server.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_ORG": "${GITHUB_ORG}"
      }
    }
  }
}
```

### commands/ci/build.md

```markdown
---
name: build
description: 触发并监控 CI build pipeline
---

# Build Command

触发 CI/CD build pipeline，并实时监控进度。

## Process

1. **Validation**：检查前置条件，包括分支状态、未提交改动和配置文件。
2. **Trigger**：通过 MCP server 启动 build。
3. **Monitor**：实时展示日志、测试进度和失败告警。
4. **Report**：汇总 build 状态、覆盖率、性能指标和部署就绪度。

## Integration

Build 成功后，可以继续：
- 提议部署到 staging
- 建议性能优化
- 生成 deployment checklist
```

### agents/orchestration/deployment-orchestrator.md

```markdown
---
description: 编排带 rollback 和健康监控能力的多环境部署
capabilities:
  - 规划并执行多阶段部署
  - 协调服务依赖
  - 监控部署健康状态
  - 执行自动 rollback
  - 管理部署审批
---

# Deployment Orchestrator Agent

用于跨多个环境编排复杂部署的专用 agent。

## Expertise

- **Deployment strategies**：blue-green、canary、rolling updates
- **Dependency management**：服务启动顺序和依赖注入
- **Health monitoring**：服务健康检查和指标验证
- **Rollback automation**：检测失败后自动 rollback
- **Approval workflows**：多阶段审批流程

## Orchestration Process

1. **Planning Phase**：分析部署需求、服务依赖、部署计划和 rollback 策略。
2. **Validation Phase**：检查环境就绪度、资源、配置和 pre-deployment tests。
3. **Execution Phase**：按依赖顺序部署服务，并在每个阶段后检查健康状态。
4. **Verification Phase**：运行 smoke tests，验证集成、性能指标和部署结果。
5. **Rollback Phase**：必要时检测失败条件、执行 rollback、恢复状态并通知相关人员。

## MCP Integration

使用多个 MCP servers：
- `kubernetes`：部署和管理容器
- `terraform`：供应基础设施
- `github-actions`：触发部署 pipeline
```

## 关键特性

### 多层级组织

- **Commands**：按功能划分为 CI、monitoring、admin
- **Agents**：按角色划分为 orchestration 与 specialized
- **Skills**：包含 references、examples、scripts 等丰富资源

### MCP 集成

三个自定义 MCP servers：
- **Kubernetes**：集群操作
- **Terraform**：基础设施供应
- **GitHub Actions**：CI/CD 自动化

### 共享库

`lib/` 中存放可复用代码：
- **Core**：日志、配置、认证等通用能力
- **Integrations**：Slack、Datadog 等外部服务
- **Utils**：retry、validation 等辅助函数

### 配置管理

`config/` 中存放环境配置：
- **Environments**：按环境区分的设置
- **Templates**：可复用部署模板

### 安全自动化

多个安全 hooks：
- 写入前扫描 secrets
- session start 时校验权限
- 任务完成时审计配置

### 监控集成

通过 lib integrations 内置监控：
- Datadog 用于 metrics
- PagerDuty 用于 alerts
- Slack 用于 notifications

## 使用场景

1. **多环境部署**：跨 dev/staging/prod 编排发布
2. **Infrastructure as code**：带 state 管理的 Terraform 自动化
3. **CI/CD 自动化**：build、test、deploy pipeline
4. **监控与可观测性**：集成 metrics 与 alerting
5. **安全约束**：自动安全扫描和验证
6. **团队协作**：Slack 通知和状态更新

## 什么时候适合这种模式

- 大规模企业部署
- 多环境管理
- 复杂 CI/CD 工作流
- 集成监控需求
- 安全敏感基础设施
- 团队协作需求

## 扩展性考虑

- **Performance**：用独立 MCP servers 支持并行操作
- **Organization**：多层目录结构便于扩展
- **Maintainability**：共享库减少重复代码
- **Flexibility**：环境配置支持定制
- **Security**：多层安全 hooks 和验证
