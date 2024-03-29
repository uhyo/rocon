# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.8](https://github.com/uhyo/rocon/compare/v1.2.7...v1.2.8) (2022-07-06)


### Bug Fixes

* correctly pass state to history.push ([b36ebad](https://github.com/uhyo/rocon/commit/b36ebadf95362a67173d6793aca98af0e6508ab9))

### [1.2.7](https://github.com/uhyo/rocon/compare/v1.2.6...v1.2.7) (2022-06-05)


### Bug Fixes

* fix resolving of routes attached to RootRouteBuilder ([3a82c51](https://github.com/uhyo/rocon/commit/3a82c5121ef93893b1badc6e20fe2c9db2aaf898)), closes [#36](https://github.com/uhyo/rocon/issues/36)

### [1.2.6](https://github.com/uhyo/rocon/compare/v1.2.5...v1.2.6) (2022-05-29)

### [1.2.5](https://github.com/uhyo/rocon/compare/v1.2.4...v1.2.5) (2022-01-17)


### Bug Fixes

* correct PathRouteBuilder#anyRoute match object type ([#29](https://github.com/uhyo/rocon/issues/29)) ([04f2edb](https://github.com/uhyo/rocon/commit/04f2edb429af24cf190ceb9f1f64386e27ef6f08)), closes [#28](https://github.com/uhyo/rocon/issues/28) [#28](https://github.com/uhyo/rocon/issues/28)

### [1.2.4](https://github.com/uhyo/rocon/compare/v1.2.3...v1.2.4) (2022-01-15)


### Bug Fixes

* pathRouteBuilder should retain separate Match for any route ([#27](https://github.com/uhyo/rocon/issues/27)) ([5d582c5](https://github.com/uhyo/rocon/commit/5d582c5c46242e26c2be60aef1fc45aba0adc15c))
* PathRouteBuilder#any discards their exactRoute ([#26](https://github.com/uhyo/rocon/issues/26)) ([00008dc](https://github.com/uhyo/rocon/commit/00008dc7af1903c72db83e7ff1a38aab027ad26c))
* **react:** fix RoconRoot not reacting to location change in descendant useEffect ([68413bb](https://github.com/uhyo/rocon/commit/68413bb1b9050df11653a336e56f952dcf175137)), closes [#24](https://github.com/uhyo/rocon/issues/24)

### [1.2.3](https://github.com/uhyo/rocon/compare/v1.2.2...v1.2.3) (2021-07-29)


### Bug Fixes

* export Redirect from react.d.ts ([455f0ac](https://github.com/uhyo/rocon/commit/455f0ac3501421faf5777d413c5e73724db9b951))

### [1.2.2](https://github.com/uhyo/rocon/compare/v1.2.1...v1.2.2) (2021-02-11)


### Bug Fixes

* **react:** react component can be now passed as an action ([68ff9fc](https://github.com/uhyo/rocon/commit/68ff9fc1723e409a407d706d81ce85bd0c731394)), closes [#5](https://github.com/uhyo/rocon/issues/5)

### [1.2.1](https://github.com/uhyo/rocon/compare/v1.2.0...v1.2.1) (2021-01-14)


### Bug Fixes

* make 2nd argument(routeDefinition) optional ([1d9695c](https://github.com/uhyo/rocon/commit/1d9695ca9979fdc7203367d10db4fece42338a4c))

## [1.2.0](https://github.com/uhyo/rocon/compare/v1.1.1...v1.2.0) (2020-12-29)


### Features

* add forward-ref to Link Component ([dd3fe76](https://github.com/uhyo/rocon/commit/dd3fe76752519f24a03c4946c0cc5a6129eebcfe))

### [1.1.1](https://github.com/uhyo/rocon/compare/v1.1.0...v1.1.1) (2020-12-04)


### Bug Fixes

* fix type errors in TS 4.1 ([cabfeb8](https://github.com/uhyo/rocon/commit/cabfeb8b9d715f040b04925f4ffed91296a7ebfa))

## [1.1.0](https://github.com/uhyo/rocon/compare/v1.0.0...v1.1.0) (2020-10-17)


### Features

* add Redirect component ([7778f9a](https://github.com/uhyo/rocon/commit/7778f9a81522ff8664632cf308241249d9e49ab9)), closes [#2](https://github.com/uhyo/rocon/issues/2)


### Bug Fixes

* improve type of route() ([cae6bb6](https://github.com/uhyo/rocon/commit/cae6bb658f2171e30d1d307b6a1ef7470c235f94)), closes [#3](https://github.com/uhyo/rocon/issues/3)
