# Interface: IBackgroundTaskServiceConfig

Interface for the background task service.

## Properties

### taskInterval? {#taskinterval}

> `optional` **taskInterval?**: `number`

The default interval to leave between tasks in milliseconds, defaults to 100ms.

***

### retryInterval? {#retryinterval}

> `optional` **retryInterval?**: `number`

The default retry interval to leave between tasks in milliseconds, defaults to 5000ms.

***

### cleanupInterval? {#cleanupinterval}

> `optional` **cleanupInterval?**: `number`

The default cleanup interval for removing retained tasks, defaults to 120000ms.

***

### maxSystemWorkerCount? {#maxsystemworkercount}

> `optional` **maxSystemWorkerCount?**: `number`

The maximum number of workers to use for processing tasks, defaults to the number of CPU cores.

***

### workerShutdownTimeout? {#workershutdowntimeout}

> `optional` **workerShutdownTimeout?**: `number`

How long in milliseconds stop() waits for each handler's workers to finish their shutdownMethod
before force-terminating them. Defaults to 5000.

***

### overrideHealthCheckHandler? {#overridehealthcheckhandler}

> `optional` **overrideHealthCheckHandler?**: `string`

The url of the handler to use for health checks. If not provided, the default health check handler will be used.
