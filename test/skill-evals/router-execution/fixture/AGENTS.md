# Cache Allocator Project Rules

- An Accepted Spec, Approved Current Plan, approved current Tasks revision, and explicit current-session authorization are all required before implementation.
- When those gates are present, execute the existing Tasks directly in dependency order; do not repeat design or create a second Bundle.
- Keep changes within each Task's `Files` list and update Task completion only after its validation is true.
- Do not invoke a dedicated execution, review, verification, or branch-finishing Skill.
- Run commands from the project root and retain exact exit statuses.
