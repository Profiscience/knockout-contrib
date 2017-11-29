import { merge } from '@profiscience/knockout-contrib-utils'
import { ConstructorBuilder } from './ConstructorBuilder'
import { SubscribableMixin } from './SubscribableMixin'
import { INITIALIZED } from './symbols'

/**
 * Creates a DataModel constructor with support for async initialization that updates
 * observable properties in derived class when params are changed. Designed for use
 * with knockout-decorators
 *
 * Example usage:
 *
 * ```
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
export class DataModelConstructorBuilder<P> extends ConstructorBuilder.Mixin(SubscribableMixin) {
  /**
   * Constructs a new DataModel instance
   *
   * @param params Parameters for the current model state. If observable, will trigger
   *  updates to observable properties when modified
   */
  constructor(protected params: P) {
    super();

    // we want to keep this mostly hidden as an implementation detail, and to make it work
    // an index property has to be added which compromises type safety
    (this as any)[INITIALIZED] = this.update()
  }

  private async update(): Promise<void> {
    merge(this, await this.fetch())
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
