


#  @profiscience/framework

## Index

### Classes

* [ConstructorBuilder](classes/constructorbuilder.md)
* [DataModelConstructorBuilder](classes/datamodelconstructorbuilder.md)
* [Route](classes/route.md)


### Interfaces

* [ILazyComponent](interfaces/ilazycomponent.md)
* [IRouteConfig](interfaces/irouteconfig.md)
* [IRoutedViewModelConstructor](interfaces/iroutedviewmodelconstructor.md)


### Variables

* [INITIALIZED](#initialized)
* [STATE](#state)
* [SUBSCRIPTIONS](#subscriptions)


### Functions

* [SubscriptionDisposalMixin](#subscriptiondisposalmixin)
* [createComponentMiddleware](#createcomponentmiddleware)
* [createTitleMiddleware](#createtitlemiddleware)
* [nonenumerable](#nonenumerable)



---
# Variables
<a id="initialized"></a>

###  INITIALIZED

**●  INITIALIZED**:  *`symbol`*  =  Symbol('INITIALIZED')

*Defined in model/builders/DataModelConstructorBuilder.ts:10*



Symbol for accessing initialization promise




___

<a id="state"></a>

###  STATE

**●  STATE**:  *`symbol`*  =  Symbol('STATE')

*Defined in route/index.ts:21*



Symbol to access state name on route. Requires casting as any in TypeScript due to symbol key limitations.

Currently only used for metaprogramming in UniversitySite, namely generating E2E state definitions.

Example:

     import { Route, STATE } from '@profiscience/framework'

     const route = new Route('/', { state: 'home' })

     route['/'][STATE] === 'home'




___

<a id="subscriptions"></a>

###  SUBSCRIPTIONS

**●  SUBSCRIPTIONS**:  *`symbol`*  =  Symbol('SUBSCRIPTIONS')

*Defined in model/mixins/SubscriptionDisposalMixin.ts:8*



Symbol to access subscriptions on viewModel instance




___


# Functions
<a id="subscriptiondisposalmixin"></a>

###  SubscriptionDisposalMixin

► **SubscriptionDisposalMixin**T(ctor: *`T`*): `Subscribable``T`



*Defined in model/mixins/SubscriptionDisposalMixin.ts:17*



Adds .subscribe(obs, fn) and .dispose() methods with subscription tracking to prevent leaks

Used by constructor builders


**Type parameters:**

#### T :  `object`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ctor | `T`   |  BaseModel |





**Returns:** `Subscribable``T`





___

<a id="createcomponentmiddleware"></a>

###  createComponentMiddleware

► **createComponentMiddleware**(getComponent: *`function`*): `(Anonymous function)`



*Defined in route/component.ts:52*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| getComponent | `function`   |  - |





**Returns:** `(Anonymous function)`





___

<a id="createtitlemiddleware"></a>

###  createTitleMiddleware

► **createTitleMiddleware**(title: *`string`⎮`function`*): `(Anonymous function)`



*Defined in route/title.ts:3*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| title | `string`⎮`function`   |  - |





**Returns:** `(Anonymous function)`





___

<a id="nonenumerable"></a>

###  nonenumerable

► **nonenumerable**(target: *`any`*, prop: *`string`*): `void`



*Defined in utils.ts:26*



Makes a property non-enumerable. NOT A DECORATOR.

Excluded from Object.keys, JSON.stringify, etc; you only find it if you're looking for it.

Useful in classes derived from DataModelConstructorBuilder to exclude from `.toJS()`.

Example usage

     import { utils } from '@profiscience/framework'

     const obj = {
       foo: true,
       bar: true,
       dontInclude: true,
       baz: true
     }

     utils.nonenumerable(obj, 'dontInclude')

     Object.keys(obj) === ['foo', 'bar', 'baz']


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| target | `any`   |  object with property, e.g. target[prop] |
| prop | `string`   |  property name |





**Returns:** `void`





___


