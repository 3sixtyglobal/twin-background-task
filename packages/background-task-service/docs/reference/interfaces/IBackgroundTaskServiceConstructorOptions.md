# Interface: IBackgroundTaskServiceConstructorOptions

Options for the background task service constructor.

## Properties

### backgroundTaskEntityStorageType?

> `optional` **backgroundTaskEntityStorageType**: `string`

The background task entity storage connector type.

#### Default

```ts
background-task
```

***

### loggingComponentType?

> `optional` **loggingComponentType**: `string`

The logging component type.

#### Default

```ts
logging
```

***

### config?

> `optional` **config**: [`IBackgroundTaskServiceConfig`](IBackgroundTaskServiceConfig.md)

The configuration for the service.
