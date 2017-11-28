import { INITIALIZED } from '../symbols'

export type MaybeObservable<T> = KnockoutObservable<T> | T
export type MaybeObservableArray<T> = KnockoutObservableArray<T> | T

/**
 * Creates a DataModel constructor with support for async initialization, and
 * composition via mixins and `extends`. Updates observable properties in derived
 * class when params are changed. Expects knockout-decorators to be used for declaring
 * observable properties.
 *
 * Example usage:
 *
 * ```
 * import { observable } from 'knockout-decorators'
 *
 * class MyDataModel extends DataModelConstructorBuilder
 *   // using a mixin to provide `fetch`
 *   .Mixin(RESTMixin('https://example.com/some/api/endpoint')) {
 *
 *   // define which properties should be observable using decorators
 *   @observable
 *   public somePropertyInAPIResponseThatShouldBeObservable: string
 *
 *   public somePropertyInAPIResponseThatShouldNotBeObservable: string
 *
 *   // using a custom fetch method
 *   protected async fetch() {
 *     return await $.get('https://example.com/some/api/endpoint')
 *   }
 * }
 * ```
 */
export class DataModelConstructorBuilder {
  [k: string]: any

  /**
   * Constructs a new DataModel instance
   *
   * @param params Parameters for the current model state. If observable, will trigger
   *  updates to observable properties when modified
   */
  constructor(protected params: { [k: string]: MaybeObservable<any> | MaybeObservableArray<any> }) {
    this[INITIALIZED] = this.fetch()
      .then((data: any) => {
        Object.assign(this, data)
      })
      .catch((err: Error) => {
        // tslint:disable-next-line no-console
        console.error('Error fetching data for model:', err.message)
      })
  }

  /**
   * Model hook for disposing subscriptions, unhooking event listeners, and doing other cleanup
   *
   * By default, does nothing, but allows composing disposals via super.dispose() in mixins and
   * derived classes without relying on manual composition in the constructor.
   */
  public dispose(): void { /* noop */ }

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
  public static async create(params: any) {
    const instance = Reflect.construct(this, [params])
    await instance[INITIALIZED]
    return instance
  }

  /**
   * Dynamically applies mixins and returns a new constructor using the following pattern:
   *
   * ```
   * class MyDataModel extends DataModelConstructorBuilder.Mixin(myMixin) {}
   * ```
   *
   * @param mixin Mixin to apply to constructor
   */
  public static Mixin<
    T1 extends { new(...args: any[]): DataModelConstructorBuilder },
    T2 extends { new(...args: any[]): DataModelConstructorBuilder }
  >(
    this: T1, mixin: (base: T1) => T2
  ) {
    return mixin(this)
  }
}
