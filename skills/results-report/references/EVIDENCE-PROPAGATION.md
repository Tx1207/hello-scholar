# 证据传播

使用本文件保证 `results-analysis` 的输出与最终报告保持一致。

## 映射规则

- `analysis-report.md` -> main findings 和 narrative summary
- `stats-appendix.md` -> test choice、uncertainty、effect size、correction rule
- `figure-catalog.md` -> figure purpose 和逐图解释脚手架
- figure files -> `Figure-by-Figure Interpretation` 中引用的视觉证据

## 最小统计继承要求

results report 中的每个强 claim 都应保留：
- sample size 或 run/seed count
- metric definition
- uncertainty summary
- test name
- relevant 时的 effect size
- relevant 时的 multiple-comparison handling

## 不支持 claim 规则

如果 analysis bundle 不足以强支撑某个 claim，应保持 tentative，并说明原因。写报告时不要把 suggestive result 升级成 decisive conclusion。
