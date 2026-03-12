# Interface: ITaskSchedulerConfig

Interface for the task scheduler configuration.

## Properties

### intervalMs? {#intervalms}

> `optional` **intervalMs**: `number`

The interval between checks for running tasks, defaults to 1 minute since that is the resolution of the tasks.

***

### stalledTaskTimeoutMs? {#stalledtasktimeoutms}

> `optional` **stalledTaskTimeoutMs**: `number`

The time in milliseconds after which a task that is still marked as running is considered stalled and can be run again.
