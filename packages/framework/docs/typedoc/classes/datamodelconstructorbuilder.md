[framework](../README.md) > [DataModelConstructorBuilder](../classes/datamodelconstructorbuilder.md)



# Class: DataModelConstructorBuilder


Creates a DataModel constructor with support for async initialization that updates observable properties in derived class when params are changed.

Example usage:

    import { observable } from 'knockout-decorators'

    type MyDataModelParams = {}

    class MyDataModel extends DataModelConstructorBuilder
      // using a mixin to provide `fetch`
      .Mixin(RESTMixin('https://example.com/some/api/endpoint'))

      // define params type
      <MyDataModelParams>{

      // define which properties should be observable using decorators
      @observable
      public somePropertyInAPIResponseThatShouldBeObservable: string
      // define non-observable props too for type-safety/autocomplete
      public somePropertyInAPIResponseThatShouldNotBeObservable: string

      // using a custom fetch method
      protected async fetch() {
        return await $.get('https://example.com/some/api/endpoint')
      }
    }

    const model = await MyDataModel.create()

    model.dispose()

## Type parameters
#### P 
## Hierarchy


 `Subscribable`.<[ConstructorBuilder](constructorbuilder.md)>,.<`this`>[ConstructorBuilder](constructorbuilder.md)`this`

**↳ DataModelConstructorBuilder**







## Index

### Constructors

* [constructor](datamodelconstructorbuilder.md#constructor)


### Properties

* [loading](datamodelconstructorbuilder.md#loading)
* [params](datamodelconstructorbuilder.md#params)


### Methods

* [fetch](datamodelconstructorbuilder.md#fetch)
* [toJS](datamodelconstructorbuilder.md#tojs)
* [update](datamodelconstructorbuilder.md#update)
* [create](datamodelconstructorbuilder.md#create)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new DataModelConstructorBuilder**(params: *`P`*): [DataModelConstructorBuilder](datamodelconstructorbuilder.md)


*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:52*



Constructs a new DataModel instance


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `P`   |  Parameters for the current model state. If observable, will trigger updates to observable properties when modified |





**Returns:** [DataModelConstructorBuilder](datamodelconstructorbuilder.md)

---


## Properties
<a id="loading"></a>

###  loading

**●  loading**:  *`KnockoutObservable`.<`boolean`>*  =  ko.observable(true)

*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:52*



True if pending `.fetch()` response




___

<a id="params"></a>

### «Protected» params

**●  params**:  *`P`* 

*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:60*



Parameters for the current model state. If observable, will trigger updates to observable properties when modified




___


## Methods
<a id="fetch"></a>

### «Protected» fetch

► **fetch**(): `Promise`.<`any`>



*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:106*



Abstract method that defines how data is retrieved, typically AJAX.

Should use `this.params`, if applicable.
*__abstract__*: 





**Returns:** `Promise`.<`any`>





___

<a id="tojs"></a>

###  toJS

► **toJS**(): `any`



*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:85*



Return enumerable properties, unwrapped




**Returns:** `any`





___

<a id="update"></a>

### «Protected» update

► **update**(): `Promise`.<`void`>



*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:93*





**Returns:** `Promise`.<`void`>





___

<a id="create"></a>

### «Static» create

► **create**T(this: *`object`*, params: *`any`*): `Promise`.<`T`>



*Defined in node_modules/@profiscience/knockout-contrib-framework-model-builders-data/index.ts:115*



Factory for instantiating a model and waiting for the initial fetch to complete


**Type parameters:**

#### T 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| this | `object`   |  - |
| params | `any`   |  (Optionally) observable parameters for this instance. Will be passed to the constructor. |





**Returns:** `Promise`.<`T`>





___


