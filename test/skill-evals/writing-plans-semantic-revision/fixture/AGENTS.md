# Project Rules

- The accepted Spec defines behavior and the approved Plan defines the implementation strategy.
- `evaluate(feature, tenant) -> bool` is the stable public interface.
- The implementation must not change Architecture, packaging, networking, or persistent storage.
- Run Python verification without writing bytecode into the project tree.
