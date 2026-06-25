# Interface: IBackgroundTaskServiceConstructorOptions

Options for the background task service constructor.

## Properties

### backgroundTaskEntityStorageType? {#backgroundtaskentitystoragetype}

> `optional` **backgroundTaskEntityStorageType?**: `string`

The background task entity storage connector type.

#### Default

```ts
background-task
```

***

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType?**: `string`

The logging component type.

***

### config? {#config}

> `optional` **config?**: [`IBackgroundTaskServiceConfig`](IBackgroundTaskServiceConfig.md)

The configuration for the service.
