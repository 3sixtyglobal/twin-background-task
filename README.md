# TWIN Background Task

This repository provides a cohesive set of packages for modelling, executing, and scheduling background work in TWIN applications. Together, the packages help teams build dependable asynchronous workflows with consistent contracts and clear operational boundaries.

The overall goal is to make background processing easier to integrate and maintain by separating concerns across contracts, execution services, and scheduling orchestration. This structure supports reuse, predictable behaviour, and simpler evolution of task-driven features.

## Packages

- [background-task-models](packages/background-task-models/README.md) - Defines shared contracts and status models for background task workflows.
- [background-task-service](packages/background-task-service/README.md) - Provides a storage-backed service for creating, managing, and executing background tasks.
- [background-task-scheduler](packages/background-task-scheduler/README.md) - Schedules background tasks for one-off or recurring execution windows.

## Contributing

To contribute to this package see the guidelines for building and publishing in [CONTRIBUTING](./CONTRIBUTING.md)

## Origin

This repository is derived from the original [iotaledger/twin-background-task](https://github.com/iotaledger/twin-background-task) repository.
