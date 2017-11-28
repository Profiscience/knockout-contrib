export class ConstructorBuilder {
  /**
   * Dynamically applies mixins and returns a new constructor using the following pattern:
   *
   * ```
   * class MyModel extends ConstructorBuilder.Mixin(myMixin) {}
   * ```
   *
   * @param mixin Mixin to apply to constructor
   */
  public static Mixin<
    P,
    T1 extends { new(...args: any[]): ConstructorBuilder },
    T2 extends { new(...args: any[]): ConstructorBuilder }
  >(
    this: T1, mixin: (base: T1) => T2
  ) {
    return mixin(this)
  }
}
