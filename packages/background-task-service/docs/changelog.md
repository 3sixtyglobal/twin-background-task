# Changelog

## [0.9.2-next.1](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.2-next.0...background-task-service-v0.9.2-next.1) (2026-07-28)


### Features

* add additional logging on failure ([#36](https://github.com/iotaledger/twin-background-task/issues/36)) ([61c3672](https://github.com/iotaledger/twin-background-task/commit/61c3672d446f782959b5c93305147130b314fa01))
* add multi-threading ([#32](https://github.com/iotaledger/twin-background-task/issues/32)) ([60fb5ef](https://github.com/iotaledger/twin-background-task/commit/60fb5ef55d3f7dc46a27c38d4497812d80b98e3b))
* remove default logging ([ca9599a](https://github.com/iotaledger/twin-background-task/commit/ca9599aca7ef0375a20e19e0881eaa0e7a2cd7ac))
* remove engine dependency ([#94](https://github.com/iotaledger/twin-background-task/issues/94)) ([2fbbe25](https://github.com/iotaledger/twin-background-task/commit/2fbbe25f793c44f91de96ac4b5797bbce0de6e0e))
* switch random ids to uuidv7 ([#41](https://github.com/iotaledger/twin-background-task/issues/41)) ([707b4aa](https://github.com/iotaledger/twin-background-task/commit/707b4aab8c1c852a193b5f97947ffed0dfe15441))
* typescript 6 update ([e3f2727](https://github.com/iotaledger/twin-background-task/commit/e3f272783e0de7cf4d31f3e84a8e6f5ff633961b))
* update components ([fd66320](https://github.com/iotaledger/twin-background-task/commit/fd663205bbec282d81a4ec5756a8f332f71d31a9))
* update dependencies ([0867e02](https://github.com/iotaledger/twin-background-task/commit/0867e02fc3c034f8e8cf5918ac6cc4e6b5ca0c93))


### Bug Fixes

* call terminate() on all worker decommission paths to fix OS thread leak ([#55](https://github.com/iotaledger/twin-background-task/issues/55)) ([3eb1eda](https://github.com/iotaledger/twin-background-task/commit/3eb1eda2f9c7d7343d24c4945c2d595b1959213e))
* cleanup timers ([a0d30b4](https://github.com/iotaledger/twin-background-task/commit/a0d30b4afc485651ed9f1a3e60ad2f307fa3954a))
* correct documentation ([10bd65d](https://github.com/iotaledger/twin-background-task/commit/10bd65d38bcf002058d3ce863bae7ffd973c5203))
* execution timeout ([#86](https://github.com/iotaledger/twin-background-task/issues/86)) ([a6e0efd](https://github.com/iotaledger/twin-background-task/commit/a6e0efd6b6c5167029b5ee12df7d07a7154afbc6))
* getStore snapshots ([1086de0](https://github.com/iotaledger/twin-background-task/commit/1086de00442d14c91aba306464b807feca7b8770))
* id full urn ([#83](https://github.com/iotaledger/twin-background-task/issues/83)) ([eba9b6b](https://github.com/iotaledger/twin-background-task/commit/eba9b6bd84b229106c282c43cca9a7555456b074))
* missing sort index ([ed7fe44](https://github.com/iotaledger/twin-background-task/commit/ed7fe447f9a3e56db45696a6a4f06dfdd8a31788))
* prevent BackgroundTaskService from polling tasks when running on a worker thread ([#52](https://github.com/iotaledger/twin-background-task/issues/52)) ([113c475](https://github.com/iotaledger/twin-background-task/commit/113c4754efdd898a68e48831eb8f132893b54aba))
* prevent duplicate task dispatch on first activity ([#47](https://github.com/iotaledger/twin-background-task/issues/47)) ([a684977](https://github.com/iotaledger/twin-background-task/commit/a6849777adc1493f0ad8cfd11dc5f91bfff8e182))
* restore task context in background task state-change callbacks ([#46](https://github.com/iotaledger/twin-background-task/issues/46)) ([d4f9f3b](https://github.com/iotaledger/twin-background-task/commit/d4f9f3bb57f8fb83c62024f9a385c81e2d511920))
* test ([a15ab60](https://github.com/iotaledger/twin-background-task/commit/a15ab60bcb8f54f9a62be95391297efdcccab619))
* tests ([684e22d](https://github.com/iotaledger/twin-background-task/commit/684e22d10b7369090e132fa40e508d66021f6cbe))
* use async getStore in tests ([97931cd](https://github.com/iotaledger/twin-background-task/commit/97931cdc856e5748b621148737c2eaa14da217fa))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.9.2-next.0 to 0.9.2-next.1

## [0.9.1](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.1...background-task-service-v0.9.1) (2026-07-27)


### Features

* release to production ([7ce9896](https://github.com/iotaledger/twin-background-task/commit/7ce989659e6819f05655c86b1bda2a265af5d281))
* release to production ([#65](https://github.com/iotaledger/twin-background-task/issues/65)) ([ec3ecde](https://github.com/iotaledger/twin-background-task/commit/ec3ecdec162fa341c963f3834d5739da670af058))
* release to production ([#69](https://github.com/iotaledger/twin-background-task/issues/69)) ([2b31827](https://github.com/iotaledger/twin-background-task/commit/2b318279787beaaca3ba962c4bf397b90665bd0d))
* release to production ([#73](https://github.com/iotaledger/twin-background-task/issues/73)) ([d31b738](https://github.com/iotaledger/twin-background-task/commit/d31b73887e604751df061fc1ddadc0a6fc28dd78))
* release to production ([#91](https://github.com/iotaledger/twin-background-task/issues/91)) ([b75ced7](https://github.com/iotaledger/twin-background-task/commit/b75ced714729fe51c779b60dfb5f484f7d52d7f8))

## [0.9.1-next.5](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.1-next.4...background-task-service-v0.9.1-next.5) (2026-07-24)


### Bug Fixes

* correct documentation ([10bd65d](https://github.com/iotaledger/twin-background-task/commit/10bd65d38bcf002058d3ce863bae7ffd973c5203))
* execution timeout ([#86](https://github.com/iotaledger/twin-background-task/issues/86)) ([a6e0efd](https://github.com/iotaledger/twin-background-task/commit/a6e0efd6b6c5167029b5ee12df7d07a7154afbc6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.9.1-next.4 to 0.9.1-next.5

## [0.9.1-next.4](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.1-next.3...background-task-service-v0.9.1-next.4) (2026-07-23)


### Bug Fixes

* id full urn ([#83](https://github.com/iotaledger/twin-background-task/issues/83)) ([eba9b6b](https://github.com/iotaledger/twin-background-task/commit/eba9b6bd84b229106c282c43cca9a7555456b074))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.9.1-next.3 to 0.9.1-next.4

## [0.9.1-next.3](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.1-next.2...background-task-service-v0.9.1-next.3) (2026-07-02)


### Bug Fixes

* cleanup timers ([a0d30b4](https://github.com/iotaledger/twin-background-task/commit/a0d30b4afc485651ed9f1a3e60ad2f307fa3954a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.9.1-next.2 to 0.9.1-next.3

## [0.9.1-next.2](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.1-next.1...background-task-service-v0.9.1-next.2) (2026-06-26)


### Features

* update components ([fd66320](https://github.com/iotaledger/twin-background-task/commit/fd663205bbec282d81a4ec5756a8f332f71d31a9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.9.1-next.1 to 0.9.1-next.2

## [0.9.1-next.1](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.1-next.0...background-task-service-v0.9.1-next.1) (2026-06-26)


### Features

* add additional logging on failure ([#36](https://github.com/iotaledger/twin-background-task/issues/36)) ([61c3672](https://github.com/iotaledger/twin-background-task/commit/61c3672d446f782959b5c93305147130b314fa01))
* add multi-threading ([#32](https://github.com/iotaledger/twin-background-task/issues/32)) ([60fb5ef](https://github.com/iotaledger/twin-background-task/commit/60fb5ef55d3f7dc46a27c38d4497812d80b98e3b))
* remove default logging ([ca9599a](https://github.com/iotaledger/twin-background-task/commit/ca9599aca7ef0375a20e19e0881eaa0e7a2cd7ac))
* switch random ids to uuidv7 ([#41](https://github.com/iotaledger/twin-background-task/issues/41)) ([707b4aa](https://github.com/iotaledger/twin-background-task/commit/707b4aab8c1c852a193b5f97947ffed0dfe15441))
* typescript 6 update ([e3f2727](https://github.com/iotaledger/twin-background-task/commit/e3f272783e0de7cf4d31f3e84a8e6f5ff633961b))
* update dependencies ([0867e02](https://github.com/iotaledger/twin-background-task/commit/0867e02fc3c034f8e8cf5918ac6cc4e6b5ca0c93))


### Bug Fixes

* call terminate() on all worker decommission paths to fix OS thread leak ([#55](https://github.com/iotaledger/twin-background-task/issues/55)) ([3eb1eda](https://github.com/iotaledger/twin-background-task/commit/3eb1eda2f9c7d7343d24c4945c2d595b1959213e))
* getStore snapshots ([1086de0](https://github.com/iotaledger/twin-background-task/commit/1086de00442d14c91aba306464b807feca7b8770))
* missing sort index ([ed7fe44](https://github.com/iotaledger/twin-background-task/commit/ed7fe447f9a3e56db45696a6a4f06dfdd8a31788))
* prevent BackgroundTaskService from polling tasks when running on a worker thread ([#52](https://github.com/iotaledger/twin-background-task/issues/52)) ([113c475](https://github.com/iotaledger/twin-background-task/commit/113c4754efdd898a68e48831eb8f132893b54aba))
* prevent duplicate task dispatch on first activity ([#47](https://github.com/iotaledger/twin-background-task/issues/47)) ([a684977](https://github.com/iotaledger/twin-background-task/commit/a6849777adc1493f0ad8cfd11dc5f91bfff8e182))
* restore task context in background task state-change callbacks ([#46](https://github.com/iotaledger/twin-background-task/issues/46)) ([d4f9f3b](https://github.com/iotaledger/twin-background-task/commit/d4f9f3bb57f8fb83c62024f9a385c81e2d511920))
* test ([a15ab60](https://github.com/iotaledger/twin-background-task/commit/a15ab60bcb8f54f9a62be95391297efdcccab619))
* tests ([684e22d](https://github.com/iotaledger/twin-background-task/commit/684e22d10b7369090e132fa40e508d66021f6cbe))
* use async getStore in tests ([97931cd](https://github.com/iotaledger/twin-background-task/commit/97931cdc856e5748b621148737c2eaa14da217fa))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.9.1-next.0 to 0.9.1-next.1

## [0.9.0](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.0...background-task-service-v0.9.0) (2026-06-25)


### Features

* release to production ([7ce9896](https://github.com/iotaledger/twin-background-task/commit/7ce989659e6819f05655c86b1bda2a265af5d281))
* release to production ([#65](https://github.com/iotaledger/twin-background-task/issues/65)) ([ec3ecde](https://github.com/iotaledger/twin-background-task/commit/ec3ecdec162fa341c963f3834d5739da670af058))
* release to production ([#69](https://github.com/iotaledger/twin-background-task/issues/69)) ([2b31827](https://github.com/iotaledger/twin-background-task/commit/2b318279787beaaca3ba962c4bf397b90665bd0d))
* release to production ([#73](https://github.com/iotaledger/twin-background-task/issues/73)) ([d31b738](https://github.com/iotaledger/twin-background-task/commit/d31b73887e604751df061fc1ddadc0a6fc28dd78))

## [0.9.0-next.1](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.9.0-next.0...background-task-service-v0.9.0-next.1) (2026-06-23)


### Features

* add additional logging on failure ([#36](https://github.com/iotaledger/twin-background-task/issues/36)) ([61c3672](https://github.com/iotaledger/twin-background-task/commit/61c3672d446f782959b5c93305147130b314fa01))
* add multi-threading ([#32](https://github.com/iotaledger/twin-background-task/issues/32)) ([60fb5ef](https://github.com/iotaledger/twin-background-task/commit/60fb5ef55d3f7dc46a27c38d4497812d80b98e3b))
* remove default logging ([ca9599a](https://github.com/iotaledger/twin-background-task/commit/ca9599aca7ef0375a20e19e0881eaa0e7a2cd7ac))
* switch random ids to uuidv7 ([#41](https://github.com/iotaledger/twin-background-task/issues/41)) ([707b4aa](https://github.com/iotaledger/twin-background-task/commit/707b4aab8c1c852a193b5f97947ffed0dfe15441))
* typescript 6 update ([e3f2727](https://github.com/iotaledger/twin-background-task/commit/e3f272783e0de7cf4d31f3e84a8e6f5ff633961b))
* update dependencies ([0867e02](https://github.com/iotaledger/twin-background-task/commit/0867e02fc3c034f8e8cf5918ac6cc4e6b5ca0c93))


### Bug Fixes

* call terminate() on all worker decommission paths to fix OS thread leak ([#55](https://github.com/iotaledger/twin-background-task/issues/55)) ([3eb1eda](https://github.com/iotaledger/twin-background-task/commit/3eb1eda2f9c7d7343d24c4945c2d595b1959213e))
* getStore snapshots ([1086de0](https://github.com/iotaledger/twin-background-task/commit/1086de00442d14c91aba306464b807feca7b8770))
* missing sort index ([ed7fe44](https://github.com/iotaledger/twin-background-task/commit/ed7fe447f9a3e56db45696a6a4f06dfdd8a31788))
* prevent BackgroundTaskService from polling tasks when running on a worker thread ([#52](https://github.com/iotaledger/twin-background-task/issues/52)) ([113c475](https://github.com/iotaledger/twin-background-task/commit/113c4754efdd898a68e48831eb8f132893b54aba))
* prevent duplicate task dispatch on first activity ([#47](https://github.com/iotaledger/twin-background-task/issues/47)) ([a684977](https://github.com/iotaledger/twin-background-task/commit/a6849777adc1493f0ad8cfd11dc5f91bfff8e182))
* restore task context in background task state-change callbacks ([#46](https://github.com/iotaledger/twin-background-task/issues/46)) ([d4f9f3b](https://github.com/iotaledger/twin-background-task/commit/d4f9f3bb57f8fb83c62024f9a385c81e2d511920))
* test ([a15ab60](https://github.com/iotaledger/twin-background-task/commit/a15ab60bcb8f54f9a62be95391297efdcccab619))
* tests ([684e22d](https://github.com/iotaledger/twin-background-task/commit/684e22d10b7369090e132fa40e508d66021f6cbe))
* use async getStore in tests ([97931cd](https://github.com/iotaledger/twin-background-task/commit/97931cdc856e5748b621148737c2eaa14da217fa))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.9.0-next.0 to 0.9.0-next.1

## [0.0.3-next.13](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.12...background-task-service-v0.0.3-next.13) (2026-06-11)


### Bug Fixes

* call terminate() on all worker decommission paths to fix OS thread leak ([#55](https://github.com/iotaledger/twin-background-task/issues/55)) ([3eb1eda](https://github.com/iotaledger/twin-background-task/commit/3eb1eda2f9c7d7343d24c4945c2d595b1959213e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.12 to 0.0.3-next.13

## [0.0.3-next.12](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.11...background-task-service-v0.0.3-next.12) (2026-06-11)


### Features

* remove default logging ([ca9599a](https://github.com/iotaledger/twin-background-task/commit/ca9599aca7ef0375a20e19e0881eaa0e7a2cd7ac))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.11 to 0.0.3-next.12

## [0.0.3-next.11](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.10...background-task-service-v0.0.3-next.11) (2026-06-10)


### Bug Fixes

* prevent BackgroundTaskService from polling tasks when running on a worker thread ([#52](https://github.com/iotaledger/twin-background-task/issues/52)) ([113c475](https://github.com/iotaledger/twin-background-task/commit/113c4754efdd898a68e48831eb8f132893b54aba))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.10 to 0.0.3-next.11

## [0.0.3-next.10](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.9...background-task-service-v0.0.3-next.10) (2026-06-09)


### Bug Fixes

* prevent duplicate task dispatch on first activity ([#47](https://github.com/iotaledger/twin-background-task/issues/47)) ([a684977](https://github.com/iotaledger/twin-background-task/commit/a6849777adc1493f0ad8cfd11dc5f91bfff8e182))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.9 to 0.0.3-next.10

## [0.0.3-next.9](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.8...background-task-service-v0.0.3-next.9) (2026-06-08)


### Features

* add additional logging on failure ([#36](https://github.com/iotaledger/twin-background-task/issues/36)) ([61c3672](https://github.com/iotaledger/twin-background-task/commit/61c3672d446f782959b5c93305147130b314fa01))
* add multi-threading ([#32](https://github.com/iotaledger/twin-background-task/issues/32)) ([60fb5ef](https://github.com/iotaledger/twin-background-task/commit/60fb5ef55d3f7dc46a27c38d4497812d80b98e3b))
* switch random ids to uuidv7 ([#41](https://github.com/iotaledger/twin-background-task/issues/41)) ([707b4aa](https://github.com/iotaledger/twin-background-task/commit/707b4aab8c1c852a193b5f97947ffed0dfe15441))
* typescript 6 update ([e3f2727](https://github.com/iotaledger/twin-background-task/commit/e3f272783e0de7cf4d31f3e84a8e6f5ff633961b))
* update dependencies ([0867e02](https://github.com/iotaledger/twin-background-task/commit/0867e02fc3c034f8e8cf5918ac6cc4e6b5ca0c93))


### Bug Fixes

* getStore snapshots ([1086de0](https://github.com/iotaledger/twin-background-task/commit/1086de00442d14c91aba306464b807feca7b8770))
* missing sort index ([ed7fe44](https://github.com/iotaledger/twin-background-task/commit/ed7fe447f9a3e56db45696a6a4f06dfdd8a31788))
* restore task context in background task state-change callbacks ([#46](https://github.com/iotaledger/twin-background-task/issues/46)) ([d4f9f3b](https://github.com/iotaledger/twin-background-task/commit/d4f9f3bb57f8fb83c62024f9a385c81e2d511920))
* test ([a15ab60](https://github.com/iotaledger/twin-background-task/commit/a15ab60bcb8f54f9a62be95391297efdcccab619))
* tests ([684e22d](https://github.com/iotaledger/twin-background-task/commit/684e22d10b7369090e132fa40e508d66021f6cbe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.8 to 0.0.3-next.9

## [0.0.3-next.8](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.7...background-task-service-v0.0.3-next.8) (2026-06-08)


### Bug Fixes

* restore task context in background task state-change callbacks ([#46](https://github.com/iotaledger/twin-background-task/issues/46)) ([d4f9f3b](https://github.com/iotaledger/twin-background-task/commit/d4f9f3bb57f8fb83c62024f9a385c81e2d511920))
* test ([a15ab60](https://github.com/iotaledger/twin-background-task/commit/a15ab60bcb8f54f9a62be95391297efdcccab619))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.7 to 0.0.3-next.8

## [0.0.3-next.7](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.6...background-task-service-v0.0.3-next.7) (2026-05-20)


### Features

* update dependencies ([0867e02](https://github.com/iotaledger/twin-background-task/commit/0867e02fc3c034f8e8cf5918ac6cc4e6b5ca0c93))


### Bug Fixes

* getStore snapshots ([1086de0](https://github.com/iotaledger/twin-background-task/commit/1086de00442d14c91aba306464b807feca7b8770))
* tests ([684e22d](https://github.com/iotaledger/twin-background-task/commit/684e22d10b7369090e132fa40e508d66021f6cbe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.6 to 0.0.3-next.7

## [0.0.3-next.6](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.5...background-task-service-v0.0.3-next.6) (2026-05-11)


### Features

* typescript 6 update ([e3f2727](https://github.com/iotaledger/twin-background-task/commit/e3f272783e0de7cf4d31f3e84a8e6f5ff633961b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.5 to 0.0.3-next.6

## [0.0.3-next.5](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.4...background-task-service-v0.0.3-next.5) (2026-04-10)


### Features

* switch random ids to uuidv7 ([#41](https://github.com/iotaledger/twin-background-task/issues/41)) ([707b4aa](https://github.com/iotaledger/twin-background-task/commit/707b4aab8c1c852a193b5f97947ffed0dfe15441))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.4 to 0.0.3-next.5

## [0.0.3-next.4](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.3...background-task-service-v0.0.3-next.4) (2026-02-23)


### Miscellaneous Chores

* **background-task-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.3 to 0.0.3-next.4

## [0.0.3-next.3](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.2...background-task-service-v0.0.3-next.3) (2026-01-07)


### Features

* add additional logging on failure ([#36](https://github.com/iotaledger/twin-background-task/issues/36)) ([61c3672](https://github.com/iotaledger/twin-background-task/commit/61c3672d446f782959b5c93305147130b314fa01))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.2 to 0.0.3-next.3

## [0.0.3-next.2](https://github.com/iotaledger/twin-background-task/compare/background-task-service-v0.0.3-next.1...background-task-service-v0.0.3-next.2) (2025-11-28)


### Features

* add multi-threading ([#32](https://github.com/iotaledger/twin-background-task/issues/32)) ([60fb5ef](https://github.com/iotaledger/twin-background-task/commit/60fb5ef55d3f7dc46a27c38d4497812d80b98e3b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/background-task-models bumped from 0.0.3-next.1 to 0.0.3-next.2

## Changelog
