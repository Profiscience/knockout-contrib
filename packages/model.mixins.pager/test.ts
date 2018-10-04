// tslint:disable max-classes-per-file

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

import { PagerMixin } from './index'

const FOOS = ['foo', 'bar', 'baz', 'qux']

describe('model.mixins.pager', () => {
  test('adds .getMore() method that loads next page', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      PagerMixin('foos')
    )<P> {
      public foos = ko.observableArray()

      protected async fetch(): Promise<any> {
        return {
          foos: [FOOS[this.params.page - 1]]
        }
      }
    }

    const model = await DataModel.create({})

    expect(ko.toJS(model.foos())).toEqual(FOOS.slice(0, 1))

    await model.getMore()

    expect(ko.toJS(model.foos())).toEqual(FOOS.slice(0, 2))

    await model.getMore()

    expect(ko.toJS(model.foos())).toEqual(FOOS.slice(0, 3))

    await model.getMore()

    expect(ko.toJS(model.foos())).toEqual(FOOS)
  })

  test('.getMore() method has bound "this" value', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      PagerMixin('foos')
    )<P> {
      public foos = ko.observableArray()

      protected async fetch(): Promise<any> {
        return {
          foos: [FOOS[this.params.page - 1]]
        }
      }
    }

    const model = await DataModel.create({})

    expect(ko.toJS(model.foos())).toEqual(FOOS.slice(0, 1))

    await model.getMore.call(null)

    expect(ko.toJS(model.foos())).toEqual(FOOS.slice(0, 2))
  })

  test('.hasMore() is observable', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      PagerMixin('foos')
    )<P> {
      public foos = ko.observableArray()

      protected async fetch(): Promise<any> {
        return {
          foos:
            this.params.page > FOOS.length ? [] : [FOOS[this.params.page - 1]]
        }
      }
    }

    const model = await DataModel.create({})

    await model.getMore()
    expect(model.hasMore()).toBe(true)
    await model.getMore()
    expect(model.hasMore()).toBe(true)
    await model.getMore()
    expect(model.hasMore()).toBe(false)

    expect(model.foos()).toEqual(FOOS)
  })

  test('resolves false when no more records, else true', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      PagerMixin('foos')
    )<P> {
      public foos = ko.observableArray()

      protected async fetch(): Promise<any> {
        return {
          foos:
            this.params.page > FOOS.length ? [] : [FOOS[this.params.page - 1]]
        }
      }
    }

    const model = await DataModel.create({})

    await expect(model.getMore()).resolves.toBe(true)
    await expect(model.getMore()).resolves.toBe(true)
    await expect(model.getMore()).resolves.toBe(true)
    await expect(model.getMore()).resolves.toBe(false)
  })

  test('resets the page when other params change', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      PagerMixin('foos')
    )<P> {
      public foos = ko.observableArray()

      protected async fetch(): Promise<any> {
        return {
          foos:
            this.params.page >= FOOS.length ? [] : [FOOS[this.params.page - 1]]
        }
      }
    }

    const extraneous = ko.observable(false)

    const model = await DataModel.create({ extraneous })

    await expect(model.getMore()).resolves.toBe(true)
    await expect(model.getMore()).resolves.toBe(true)

    expect(ko.toJS(model.foos())).toEqual(FOOS.slice(0, 3))

    extraneous(true)

    await new Promise((resolve) => model.foos.subscribe(resolve))

    expect(ko.toJS(model.foos())).toEqual(FOOS.slice(0, 1))

    await model.getMore()

    expect(ko.toJS(model.foos())).toEqual(FOOS.slice(0, 2))
  })

  test('resets hasMore when other params change if the second page exists', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      PagerMixin('foos')
    )<P> {
      public foos = ko.observableArray()

      protected async fetch(): Promise<any> {
        return {
          foos:
            this.params.page > FOOS.length ? [] : [FOOS[this.params.page - 1]]
        }
      }
    }

    const extraneous = ko.observable(false)

    const model = await DataModel.create({ extraneous })

    await expect(model.getMore()).resolves.toBe(true)
    await expect(model.getMore()).resolves.toBe(true)
    await expect(model.getMore()).resolves.toBe(true)
    await expect(model.getMore()).resolves.toBe(false)

    expect(model.hasMore()).toBe(false)

    extraneous(true)

    await new Promise((resolve) => {
      ko.when(model.hasMore, (v) => {
        expect(v).toBe(true)
        resolve()
      })
    })
  })

  test('can use custom strategy', async () => {
    const strategy = (page: number) => ({ pageNumber: page })
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      PagerMixin('foos', strategy)
    )<P> {
      public foos = ko.observableArray()

      protected async fetch(): Promise<any> {
        return {
          foos:
            this.params.pageNumber > FOOS.length
              ? []
              : [FOOS[this.params.pageNumber - 1]]
        }
      }
    }

    const model = await DataModel.create({})

    await model.getMore()
    expect(model.hasMore()).toBe(true)
    await model.getMore()
    expect(model.hasMore()).toBe(true)
    await model.getMore()
    expect(model.hasMore()).toBe(false)

    expect(ko.toJS(model.foos())).toEqual(FOOS)
  })
})
