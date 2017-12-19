[@profiscience/framework](../README.md) > [Route](../classes/route.md)



# Class: Route


Creates a new route consumable by @profiscience/knockout-contrib-router.

For convenience, Router is re-exported from @profiscience/knockout-contrib-router.

Example:

     import { Route, Router } from '@profiscience/framework'

     const routes = [
       new Route('/', { state: 'home', component: ... }),
       new Route('/users', {
         state: 'user',
         children: [
           new Route('/', { state: 'list', component: ... }),
           new Route('/:id', { state: 'show', component: ... })
         ]
       })
     ]

For all available properties, see IRouteConfig

## Indexable

\[path: `string`\]:&nbsp;`NormalizedRouteConfig`[]
Creates a new route consumable by @profiscience/knockout-contrib-router.

For convenience, Router is re-exported from @profiscience/knockout-contrib-router.

Example:

     import { Route, Router } from '@profiscience/framework'

     const routes = [
       new Route('/', { state: 'home', component: ... }),
       new Route('/users', {
         state: 'user',
         children: [
           new Route('/', { state: 'list', component: ... }),
           new Route('/:id', { state: 'show', component: ... })
         ]
       })
     ]

For all available properties, see IRouteConfig


## Index

### Constructors

* [constructor](route.md#constructor)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new Route**(path: *`string`*, config: *[IRouteConfig](../interfaces/irouteconfig.md)*): [Route](route.md)


*Defined in route/index.ts:96*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string`   |  - |
| config | [IRouteConfig](../interfaces/irouteconfig.md)   |  - |





**Returns:** [Route](route.md)

---


