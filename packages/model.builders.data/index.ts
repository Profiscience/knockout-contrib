import * as ko from 'knockout'
import { assign } from '@profiscience/knockout-contrib-utils-assign'
import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'
import { DisposalAggregatorMixin } from '@profiscience/knockout-contrib-model-mixins-disposal-aggregator'
import { SubscriptionDisposalMixin } from '@profiscience/knockout-contrib-model-mixins-subscription-disposal'
import { INITIALIZED } from '@profiscience/knockout-contrib-router-plugins-init'

const INSTANCES = new Map<symbol, DataModelConstructorBuilder<any>>()

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
export class DataModelConstructorBuilder<
  TParams extends void | Record<string, any> = void,
  TData extends Record<string, any> = Record<string, any>
> extends ConstructorBuilder.Mixin(SubscriptionDisposalMixin).Mixin(
  DisposalAggregatorMixin
) {
  protected readonly INSTANCE_ID = Symbol('DATA_MODEL_INSTANCE')

  public [INITIALIZED]: Promise<void>

  /**
   * True if pending `.fetch()` response
   */
  public loading = ko.observable<boolean>()

  /**
   * Constructs a new DataModel instance
   *
   * @param params Parameters for the current model state. If observable, will trigger
   *  updates to observable properties when modified
   */
  constructor(protected params: TParams, initData?: TData) {
    super()

    nonenumerable(this, 'INSTANCE_ID')
    nonenumerable(this, 'params')
    nonenumerable(this, 'loading')

    if (!initData) {
      this.loading(true)
      /**
       * Assume if data is supplied then something else is responsible for updating
       * this model. Typically, initData is used when
       *  a) creating a new record
       *  b) casting a property as another class with the TransformMixin
       * In either case, it is inappropriate for the model refresh itself.
       */
      INSTANCES.set(this.INSTANCE_ID, this)
    }

    this[INITIALIZED] = this.init().then(() =>
      this.fetch(initData).then((res) => {
        assign(this, res, { strict: true })
        this.loading(false)
        this.subscribe(this.params, () => this.update())
      })
    )
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

  public async save(): Promise<void> {
    await DataModelConstructorBuilder.updateAll()
  }

  public async delete(): Promise<void> {
    this.dispose()
    await DataModelConstructorBuilder.updateAll()
  }

  protected async update(): Promise<void> {
    this.loading(true)
    assign(this, await this.fetch(), { strict: true })
    this.loading(false)
  }

  /**
   * Abstract method that provides hook for mixins to perform initialization when
   * the constructor is not suitable (async, requires access to `this` before fetch)
   */
  protected async init(): Promise<void> {
    // noop
  }

  /**
   * Abstract method that defines how data is retrieved, typically AJAX.
   *
   * Should use `this.params`, if applicable.
   *
   * @abstract
   */
  protected async fetch(initData?: TData): Promise<any> {
    if (initData) {
      return initData
    } else {
      throw new Error(
        'fetch is not implemented in derived class and no initial data supplied'
      )
    }
  }

  public dispose(): void {
    INSTANCES.delete(this.INSTANCE_ID)
    super.dispose()
  }

  /**
   * Factory for instantiating a model and waiting for the initial fetch to complete
   *
   * @param params (Optionally) observable parameters for this instance. Will be passed to the constructor.
   */
  public static async create<T, TArgs extends any[]>(
    this: new (...args: TArgs) => T,
    ...args: TArgs
  ): Promise<T> {
    const instance = Reflect.construct(this, args)
    try {
      await instance[INITIALIZED]
    } catch (e) {
      instance.dispose()
      throw e
    }
    return instance
  }

  public static async updateAll() {
    await Promise.all(Array.from(INSTANCES.values()).map((i) => i.update()))
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
 *  import { nonenumerable } from '@profiscience/knockout-contrib-model-builders-data'
 *
 *  const obj = {
 *    foo: true,
 *    bar: true,
 *    dontInclude: true,
 *    baz: true
 *  }
 *
 *  nonenumerable(obj, 'dontInclude')
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
