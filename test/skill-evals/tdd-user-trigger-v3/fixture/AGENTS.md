# Rate Window Project Rules

- Keep the public CommonJS API stable and dependency-free.
- A window is half-open: timestamps with age equal to `windowMs` are expired.
- Use Node's built-in `node:test`; do not add a test framework.
- Change only the limiter and focused tests for this request.
- Report the exact Red failure and final Green command output.
