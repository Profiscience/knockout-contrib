


#  framework

## Index

### Classes

* [ConstructorBuilder](classes/constructorbuilder.md)
* [DataModelConstructorBuilder](classes/datamodelconstructorbuilder.md)


### Variables

* [INITIALIZED](#initialized)


### Functions

* [SubscriptionDisposalMixin](#subscriptiondisposalmixin)
* [frameworkPlugin](#frameworkplugin)
* [nonenumerable](#nonenumerable)



---
# Variables
<a id="initialized"></a>

###  INITIALIZED

**●  INITIALIZED**:  *`symbol`*  =  Symbol('INITIALIZED')

*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:9*



Symbol for accessing initialization promise




___


# Functions
<a id="subscriptiondisposalmixin"></a>

###  SubscriptionDisposalMixin

► **SubscriptionDisposalMixin**T(ctor: *`T`*): `Subscribable``T`



*Defined in node_modules/@profiscience/knockout-contrib-framework-model-mixins-subscription-disposal/index.ts:15*



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

<a id="frameworkplugin"></a>

###  frameworkPlugin

► **frameworkPlugin**(): `(Anonymous function)`



*Defined in node_modules/@profiscience/knockout-contrib-framework-plugin/index.ts:8*





**Returns:** `(Anonymous function)`





___

<a id="nonenumerable"></a>

###  nonenumerable

► **nonenumerable**(target: *`any`*, prop: *`string`*): `void`



*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:147*



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


