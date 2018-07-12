import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

import { MemoizeMixin } from './index'

describe('model.mixins.memoize', () => {
  test('only one instance is created per unique params', () => {
    class Model extends DataModelConstructorBuilder.Mixin(MemoizeMixin)<any> {
      public async fetch() {
        return 'foo'
      }
    }

    // Basic
    {
      const a = new Model({ foo: 'foo' })
      const b = new Model({ foo: 'foo' })
      const c = new Model({ foo: 'bar' })
      expect(a).toBe(b)
      expect(a).not.toBe(c)
    }

    // Observable, same instance
    {
      const foo = ko.observable('foo')
      const a = new Model({ foo })
      const b = new Model({ foo })
      expect(a).toBe(b)
    }

    // Observable, same value, not same instance
    {
      const a = new Model({ foo: ko.observable('foo') })
      const b = new Model({ foo: ko.observable('foo') })
      expect(a).not.toBe(b)
    }
  })
})
