import * as ko from 'knockout'
import { merge } from '@profiscience/knockout-contrib-utils'
import { ConstructorBuilder } from '@profiscience/knockout-contrib-framework-model-builders-base'
import { SubscriptionDisposalMixin } from '@profiscience/knockout-contrib-framework-model-mixins-subscription-disposal'

/**
 * Symbol for accessing initialization promise
 */
export const INITIALIZED = Symbol('INITIALIZED')

/**
 * Creates a DataModel constructor with support for async initialization that updates
 * observable properties in derived class when params are changed.
 *
 * Example usage:
 *
 * ```typescript
 * import { observable } from 'knockout-decorators'
 *
 * type MyDataModelParams = {}
 *
 * class MyDataModel extends DataModelConstructorBuilder
 *   // using a mixin to provide `fetch`
 *   .Mixin(RESTMixin('https://example.com/some/api/endpoint'))
 *
 *   // define params type
 *   <MyDataModelParams>{
 *
 *   // define which properties should be observable using decorators
 *   @observable
 *   public somePropertyInAPIResponseThatShouldBeObservable: string
 *   // define non-observable props too for type-safety/autocomplete
 *   public somePropertyInAPIResponseThatShouldNotBeObservable: string
 *
 *   // using a custom fetch method
 *   protected async fetch() {
 *     return await $.get('https://example.com/some/api/endpoint')
 *   }
 * }
 *
 * const model = await MyDataModel.create()
 *
 * model.dispose()
 * ```
 */
export class DataModelConstructorBuilder<P> extends ConstructorBuilder.Mixin(SubscriptionDisposalMixin) {
  public [INITIALIZED]: Promise<void>

  /**
   * True if pending `.fetch()` response
   */
  public loading = ko.observable(true)

  /**
   * Constructs a new DataModel instance
   *
   * @param params Parameters for the current model state. If observable, will trigger
   *  updates to observable properties when modified
   */
  constructor(protected params: P) {
    super()

    nonenumerable(this, 'params')
    nonenumerable(this, 'loading')

    this[INITIALIZED] = this.update()
      .then(() => {
        this.subscribe(this.params, () => this.update())
      })
  }

  /**
   * Return enumerable properties, unwrapped
   */
  public toJS(): any {
    const obj: any = {}
    for (const k of Object.keys(this)) {
      obj[k] = (this as any)[k]
    }
    return ko.toJS(obj)
  }

  protected async update(): Promise<void> {
    this.loading(true)
    merge(this, await this.fetch(), true)
    this.loading(false)
  }

  /**
   * Abstract method that defines how data is retrieved, typically AJAX.
   *
   * Should use `this.params`, if applicable.
   *
   * @abstract
   */
  protected async fetch(): Promise<any> {
    throw new Error('fetch is not implemented in derived class')
  }

  /**
   * Factory for instantiating a model and waiting for the initial fetch to complete
   *
   * @param params (Optionally) observable parameters for this instance. Will be passed to the constructor.
   */
  public static async create<T>(this: { new(params: any): T }, params: any): Promise<T> {
    const instance = Reflect.construct(this, [params])
    await instance[INITIALIZED]
    return instance
  }
}

/**
 * Makes a property non-enumerable. NOT A DECORATOR.
 *
 * Excluded from Object.keys, JSON.stringify, etc; you only find it if you're looking for it.
 *
 * Useful in classes derived from DataModelConstructorBuilder to exclude from `.toJS()`.
 *
 * Example usage
 * ```typescript
 *  import { utils } from '@profiscience/framework'
 *
 *  const obj = {
 *    foo: true,
 *    bar: true,
 *    dontInclude: true,
 *    baz: true
 *  }
 *
 *  utils.nonenumerable(obj, 'dontInclude')
 *
 *  Object.keys(obj) === ['foo', 'bar', 'baz']
 * ```
 * @param target object with property, e.g. target[prop]
 * @param prop property name
 */
export function nonenumerable(target: any, prop: string) {
  Object.defineProperty(target, prop, {
    ...Object.getOwnPropertyDescriptor(target, prop),
    enumerable: false
  })
}
