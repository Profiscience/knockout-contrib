// tslint:disable max-classes-per-file

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

import { LazyMixin } from './index'

const FOOS = ['foo', 'bar', 'baz', 'qux']

describe('model.mixins.lazy', () => {
  test('does not call fetch until specified property is accessed', (done) => {
    const spy = jest.fn()

    function FoosMixin<P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }>(ctor: T) {
      return class extends ctor {
        public foos: KnockoutObservableArray<string> = ko.observableArray([])
        protected async fetch(): Promise<any> {
          spy()
          return {
            foos: FOOS
          }
        }
      }
    }

    class DataModel extends DataModelConstructorBuilder
      .Mixin(FoosMixin)
      .Mixin(LazyMixin('foos'))
      <{}> {
    }

    const model = new DataModel({})

    expect(spy).not.toBeCalled()

    model.foos()
    model.foos()
    model.foos.subscribe((v) => {
      expect(spy).toHaveBeenCalledTimes(1)
      expect(v).toEqual(FOOS)

      model.foos = ko.observableArray()
      expect(model.foos()).toEqual([])

      done()
    })

  })

  test('does not affect models created with initial data', async () => {
    const spy = jest.fn()

    function FoosMixin<P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }>(ctor: T) {
      return class extends ctor {
        public foos: KnockoutObservableArray<string> = ko.observableArray([])
        protected async fetch(): Promise<any> {
          spy()
          return {
            foos: FOOS
          }
        }
      }
    }

    class DataModel extends DataModelConstructorBuilder
      .Mixin(LazyMixin('foos'))
      <{}> {
        public foos: KnockoutObservableArray<string>
      }

    const model = await DataModel.create({}, { foos: FOOS })

    expect(model.foos()).toEqual(FOOS)
    expect(spy).not.toBeCalled()
  })
})
