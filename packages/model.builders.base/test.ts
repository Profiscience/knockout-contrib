/* tslint:disable max-classes-per-file */

import { ConstructorBuilder } from './index'

describe('model.builders.base', () => {
  test('ConstructorBuilder.Mixin(m: Mixin) returns mixed-in constructor', async () => {
    function fetchMixin<T extends { new (...args: any[]): ConstructorBuilder }>(
      ctor: T
    ) {
      return class FetchMixin extends ctor {
        public async fetch() {
          return { foo: 'bar' }
        }
      }
    }

    class BaseModel extends ConstructorBuilder.Mixin(fetchMixin) {}

    const model = new BaseModel()

    await expect(model.fetch()).resolves.toEqual({ foo: 'bar' })
  })
})
