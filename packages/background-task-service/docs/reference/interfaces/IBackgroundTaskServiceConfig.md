# Interface: IBackgroundTaskServiceConfig

Interface for the background task service.

## Properties

### taskInterval?

> `optional` **taskInterval**: `number`

The default interval to leave between tasks in milliseconds, defaults to 100ms.

***

### retryInterval?

> `optional` **retryInterval**: `number`

The default retry interval to leave between tasks in milliseconds, defaults to 5000ms.

***

### cleanupInterval?

> `optional` **cleanupInterval**: `number`

The default cleanup interval for removing retained tasks, defaults to 120000ms.

***

### maxSystemWorkerCount?

> `optional` **maxSystemWorkerCount**: `number`

The maximum number of workers to use for processing tasks, defaults to the number of CPU cores.
