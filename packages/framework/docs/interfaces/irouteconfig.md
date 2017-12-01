[@profiscience/framework](../README.md) > [IRouteConfig](../interfaces/irouteconfig.md)



# Interface: IRouteConfig


## Properties
<a id="children"></a>

### «Optional» children

**●  children**:  *[Route](../classes/route.md)[]* 

*Defined in Route.ts:93*



Nested routes




___

<a id="state"></a>

### «Optional» state

**●  state**:  *`undefined`⎮`string`* 

*Defined in Route.ts:72*



State name, currently only used for metaprogramming. Accessed with exported STATE symbol.

Example:

     import { Route, STATE } from '@profiscience/framework'

     const route = new Route('/', { state: 'home' })

     route['/'][STATE] === 'home'




___

<a id="title"></a>

### «Optional» title

**●  title**:  *`string`⎮`function`* 

*Defined in Route.ts:76*



Document title for view, can be async or sync accessor function




___

<a id="with"></a>

### «Optional» with

**●  with**:  *`undefined`⎮`object`* 

*Defined in Route.ts:103*



Additional data to extend context with.

Can be used for overriding url params, e.g.

     with: { params: { id: 0 } }




___


## Methods
<a id="component"></a>

### «Optional» component

► **component**(): [ILazyComponent](ilazycomponent.md)



*Defined in Route.ts:89*



Component accessor, intended for use with Webpack (with html-loader) for lazy-loading/code-splitting.

Example:

     component: () => ({
       template: import('./template.html'),
       viewModel: import('./viewModel')
     })




**Returns:** [ILazyComponent](ilazycomponent.md)





___


