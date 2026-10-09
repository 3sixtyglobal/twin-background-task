# Background Task Scheduler Examples

Use these snippets to configure recurring schedules and monitor trigger state for background work.

## TaskSchedulerService

```typescript
import { TaskSchedulerService } from '@3sixty/background-task-scheduler';

const scheduler = new TaskSchedulerService({
  config: {
    intervalMs: 10000,
    stalledTaskTimeoutMs: 120000
  }
});

console.log(scheduler.className()); // TaskSchedulerService
```

```typescript
import { TaskSchedulerService } from '@3sixty/background-task-scheduler';

const scheduler = new TaskSchedulerService();
const taskId = 'report-refresh';

await scheduler.addTask(
  taskId,
  [
    {
      nextTriggerTime: Date.now() + 5000,
      intervalMinutes: 10
    },
    {
      nextTriggerTime: Date.now() + 30000,
      intervalHours: 1
    }
  ],
  async () => {
    const runAt = new Date().toISOString();
    console.log('report-refresh runAt', runAt); // report-refresh runAt 2026-03-09T10:45:05.000Z
  }
);

const info = await scheduler.tasksInfo();
console.log(info.tasks[taskId].length); // 2
```

```typescript
import { TaskSchedulerService } from '@3sixty/background-task-scheduler';

const scheduler = new TaskSchedulerService();
const taskId = 'cache-prune';

await scheduler.addTask(
  taskId,
  [
    {
      nextTriggerTime: Date.now() + 1000,
      intervalMinutes: 5
    }
  ],
  async () => {
    const runAt = new Date().toISOString();
    console.log('cache-prune runAt', runAt); // cache-prune runAt 2026-03-09T10:45:01.000Z
  }
);

await scheduler.removeTask(taskId);

const infoAfterRemoval = await scheduler.tasksInfo();
console.log(taskId in infoAfterRemoval.tasks); // false

await scheduler.stop();
```

## ScheduledTask

```typescript
import { ScheduledTask } from '@3sixty/background-task-scheduler';

const scheduledTask = new ScheduledTask();
scheduledTask.id = 'nightly-index';
scheduledTask.lastRunTime = Date.now();

console.log(scheduledTask.id); // nightly-index
console.log(typeof scheduledTask.lastRunTime); // number
```

## initSchema

```typescript
import { initSchema } from '@3sixty/background-task-scheduler';

initSchema();
```
