# Background Task Packages

## background-task-models

The package defines the shared contracts, status values, and scheduling data structures used across background task workflows. It establishes a consistent semantic layer for producers, schedulers, and handlers, helping teams keep integrations aligned and maintainable as systems evolve.

- [README](../packages/background-task-models/README.md)
- [Examples](../packages/background-task-models/docs/examples.md)
- [Changelog](../packages/background-task-models/docs/changelog.md)

## background-task-service

The package delivers a storage-backed service for creating, tracking, and processing background tasks through a reusable component pattern. It supports dependable task lifecycle management and helps applications separate asynchronous execution concerns from core business logic.

- [README](../packages/background-task-service/README.md)
- [Examples](../packages/background-task-service/docs/examples.md)
- [Changelog](../packages/background-task-service/docs/changelog.md)

## background-task-scheduler

The package provides scheduling capabilities for one-off and recurring task execution, enabling controlled timing of background workloads. By encapsulating scheduling behaviour in a focused module, it improves operational predictability and keeps time-based orchestration straightforward across environments.

- [README](../packages/background-task-scheduler/README.md)
- [Examples](../packages/background-task-scheduler/docs/examples.md)
- [Changelog](../packages/background-task-scheduler/docs/changelog.md)
