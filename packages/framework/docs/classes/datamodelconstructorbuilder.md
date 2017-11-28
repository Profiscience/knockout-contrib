[@profiscience/framework](../README.md) > [DataModelConstructorBuilder](../classes/datamodelconstructorbuilder.md)



# Class: DataModelConstructorBuilder


Creates a DataModel constructor with support for async initialization, and composition via mixins and `extends`. Updates observable properties in derived class when params are changed. Expects knockout-decorators to be used for declaring observable properties.

Example usage:

    import { observable } from 'knockout-decorators'

    class MyDataModel extends DataModelConstructorBuilder
      // using a mixin to provide `fetch`
      .Mixin(RESTMixin('https://example.com/some/api/endpoint')) {

      // define which properties should be observable using decorators
      @observable
      public somePropertyInAPIResponseThatShouldBeObservable: string

      public somePropertyInAPIResponseThatShouldNotBeObservable: string

      // using a custom fetch method
      protected async fetch() {
        return await $.get('https://example.com/some/api/endpoint')
      }
    }

## Indexable

\[k: `string`\]:&nbsp;`any`
Creates a DataModel constructor with support for async initialization, and composition via mixins and `extends`. Updates observable properties in derived class when params are changed. Expects knockout-decorators to be used for declaring observable properties.

Example usage:

    import { observable } from 'knockout-decorators'

    class MyDataModel extends DataModelConstructorBuilder
      // using a mixin to provide `fetch`
      .Mixin(RESTMixin('https://example.com/some/api/endpoint')) {

      // define which properties should be observable using decorators
      @observable
      public somePropertyInAPIResponseThatShouldBeObservable: string

      public somePropertyInAPIResponseThatShouldNotBeObservable: string

      // using a custom fetch method
      protected async fetch() {
        return await $.get('https://example.com/some/api/endpoint')
      }
    }


## Index

### Constructors

* [constructor](datamodelconstructorbuilder.md#constructor)


### Properties

* [params](datamodelconstructorbuilder.md#params)


### Methods

* [dispose](datamodelconstructorbuilder.md#dispose)
* [fetch](datamodelconstructorbuilder.md#fetch)
* [Mixin](datamodelconstructorbuilder.md#mixin)
* [create](datamodelconstructorbuilder.md#create)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new DataModelConstructorBuilder**(params: *`object`*): [DataModelConstructorBuilder](datamodelconstructorbuilder.md)


*Defined in model/DataModelConstructorBuilder.ts:35*



Constructs a new DataModel instance


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `object`   |  Parameters for the current model state. If observable, will trigger updates to observable properties when modified |





**Returns:** [DataModelConstructorBuilder](datamodelconstructorbuilder.md)

---


## Properties
<a id="params"></a>

### «Protected» params

**●  params**:  *`object`* 

*Defined in model/DataModelConstructorBuilder.ts:43*



Parameters for the current model state. If observable, will trigger updates to observable properties when modified

#### Type declaration


[k: `string`]: [MaybeObservable](../#maybeobservable)`any`⎮[MaybeObservableArray](../#maybeobservablearray)`any`






___


## Methods
<a id="dispose"></a>

###  dispose

► **dispose**(): `void`



*Defined in model/DataModelConstructorBuilder.ts:60*



Model hook for disposing subscriptions, unhooking event listeners, and doing other cleanup

By default, does nothing, but allows composing disposals via super.dispose() in mixins and derived classes without relying on manual composition in the constructor.




**Returns:** `void`





___

<a id="fetch"></a>

### «Protected» fetch

► **fetch**(): `Promise`.<`any`>



*Defined in model/DataModelConstructorBuilder.ts:69*



Abstract method that defines how data is retrieved, typically AJAX.

Should use `this.params`, if applicable.
*__abstract__*: 





**Returns:** `Promise`.<`any`>





___

<a id="mixin"></a>

### «Static» Mixin

► **Mixin**T1,T2(this: *`T1`*, mixin: *`function`*): `T2`



*Defined in model/DataModelConstructorBuilder.ts:93*



Dynamically applies mixins and returns a new constructor using the following pattern:

    class MyDataModel extends DataModelConstructorBuilder.Mixin(myMixin) {}


**Type parameters:**

#### T1 :  `object`
#### T2 :  `object`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| this | `T1`   |  - |
| mixin | `function`   |  Mixin to apply to constructor |





**Returns:** `T2`





___

<a id="create"></a>

### «Static» create

► **create**(params: *`any`*): `Promise`.<`any`>



*Defined in model/DataModelConstructorBuilder.ts:78*



Factory for instantiating a model and waiting for the initial fetch to complete


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `any`   |  (Optionally) observable parameters for this instance. Will be passed to the constructor. |





**Returns:** `Promise`.<`any`>





___


