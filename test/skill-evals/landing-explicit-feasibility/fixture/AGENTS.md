# Project Rules

- Read the public API, Architecture, Takeoff thesis, capacity baseline, and caller before repricing the direction.
- Run the unit suite and `python3 -B scripts/show_capacity.py` before making feasibility claims.
- Treat the query signature and tenant isolation as product constraints; treat the current internal layout as replaceable.
- Feasibility analysis is read-only and must stop before design or implementation steps.
