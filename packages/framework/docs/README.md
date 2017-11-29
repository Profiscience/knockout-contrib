
# @profiscience/framework

[![Version][npm-version-shield]][npm]
[![License][wtfpl-shield]][wtfpl]
[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]

This repository is a work-in-progress.

[travis-ci]: https://travis-ci.org/Profiscience/framework/
[travis-ci-shield]: https://img.shields.io/travis/Profiscience/framework/master.svg

[codecov]: https://codecov.io/gh/Profiscience/framework
[codecov-shield]: https://img.shields.io/codecov/c/github/Profiscience/framework.svg

[david-dm]: https://david-dm.org/Profiscience/framework
[david-dm-shield]: https://david-dm.org/Profiscience/framework/status.svg

[david-dm-peer]: https://david-dm.org/Profiscience/framework?type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/framework/peer-status.svg

[david-dm-dev]: https://david-dm.org/Profiscience/framework?type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/framework/dev-status.svg

[npm]: https://www.npmjs.com/package/@profiscience/framework
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/framework.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/framework&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/framework.svg?maxAge=2592000

[wtfpl]: ./LICENSE.md
[wtfpl-shield]: https://img.shields.io/npm/l/@profiscience/framework.svg


## Index

### Classes

* [ConstructorBuilder](classes/constructorbuilder.md)
* [DataModelConstructorBuilder](classes/datamodelconstructorbuilder.md)


### Variables

* [INITIALIZED](#initialized)
* [SUBSCRIPTIONS](#subscriptions)


### Functions

* [SubscriptionDisposalMixin](#subscriptiondisposalmixin)
* [nonenumerable](#nonenumerable)



---
# Variables
<a id="initialized"></a>

###  INITIALIZED

**●  INITIALIZED**:  *`symbol`*  =  Symbol('INITIALIZED')

*Defined in symbols.ts:1*





___

<a id="subscriptions"></a>

###  SUBSCRIPTIONS

**●  SUBSCRIPTIONS**:  *`symbol`*  =  Symbol('SUBSCRIPTIONS')

*Defined in SubscriptionDisposalMixin.ts:5*





___


# Functions
<a id="subscriptiondisposalmixin"></a>

###  SubscriptionDisposalMixin

► **SubscriptionDisposalMixin**T(ctor: *`T`*): `Subscribable``T`



*Defined in SubscriptionDisposalMixin.ts:13*



Adds .subscribe(obs, fn) and .dispose() methods with subscription tracking to prevent leaks


**Type parameters:**

#### T :  `object`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ctor | `T`   |  BaseModel |





**Returns:** `Subscribable``T`





___

<a id="nonenumerable"></a>

###  nonenumerable

► **nonenumerable**(target: *`any`*, prop: *`string`*): `void`



*Defined in utils.ts:1*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| target | `any`   |  - |
| prop | `string`   |  - |





**Returns:** `void`





___


