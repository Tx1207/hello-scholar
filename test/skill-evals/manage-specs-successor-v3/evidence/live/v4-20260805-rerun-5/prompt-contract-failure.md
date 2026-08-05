# Invalid Evaluator Prompt Contract

This attempt is diagnostic only and is not a Formal Eval pass or fail.

- Round 0 reached a valid zero-write stop.
- Eval main resumed the correct same-case Agent with the exact next Protocol message.
- However, the outer Agent launch prompt had described the Round 0 task file as the permanent “complete and exclusive task contract” and ordered the Agent to handle that round only.
- The Agent therefore rejected the valid later round as another workflow.
- No project bytes changed, no Reviewer was launched, and no Scorecard was created.

The replacement attempt changes only the evaluator prompt projection: it declares a finite multi-round interaction while withholding every future message until its observed stop.
