格式校正：你上一轮的实体审核结论已保存，但 `HARD_GATES` 和 `QUALITY` 使用了自创 ID，不能映射 approved Protocol。不要重新审核或新增事实；只基于你已读的同一 evidence 重发完整结果，并严格使用以下 ID。

HARD_GATES exactly: `identity-classification`, `approval-gate`, `supersession-integrity`, `scope-discipline`, `protocol-commands-pass`, `base-to-final-evidence`.

QUALITY behavior exactly: `identity-classification` weight 30, `approval-gate` 25, `supersession-integrity` 30, `scope-discipline` 15.

QUALITY userValue exactly: `value-visibility`, `audience-fit`, `information-design`, `actionability`, `signal-to-noise`, each weight 20. Scores only 0/90/100; give weighted total and evidence paths.

Keep exact sections `RESULT`, `FAILURE_KIND`, `HARD_GATES`, `QUALITY`, `INTERACTION_AND_SCOPE`, `SUMMARY`. Do not introduce replacement dimensions, additional gates, fixes, or acceptance.
