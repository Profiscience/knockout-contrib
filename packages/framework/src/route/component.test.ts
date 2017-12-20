/* tslint:disable max-classes-per-file */

import * as ko from 'knockout'
import { Context } from '@profiscience/knockout-contrib-router'
import { DataModelConstructorBuilder } from '../model/builders/DataModelConstructorBuilder'
import { ViewModelConstructorBuilder } from '../model/builders/ViewModelConstructorBuilder'

import { createComponentMiddleware } from './component'

describe('component', () => {
  test('sets component, disposes registration after render', async () => {
    ko.components.register = jest.fn()
    ko.components.unregister = jest.fn()

    const template = 'Hello, World!'
    const getComponent = () => ({
      // intended for use with import('./template.html')
      template: Promise.resolve({ default: template }),
      viewModel: Promise.resolve({
        default: class extends ViewModelConstructorBuilder {}
      })
    })
    const queue = jest.fn()
    const ctx = { queue: queue as any, route: {} } as Context
    const middleware = createComponentMiddleware(getComponent)
    const lifecycle = middleware(ctx)

    lifecycle.next()

    await queue.mock.calls[0][0]

    const componentId = '__router_view_0__'
    const componentRegistrationArgs = (ko.components.register as jest.Mock).mock.calls[0]
    expect(ctx.route.component).toBe(componentId)
    expect(componentRegistrationArgs[0]).toBe(componentId)
    expect(componentRegistrationArgs[1].template).toBe(template)
    expect(componentRegistrationArgs[1].synchronous).toBe(true)
    expect(componentRegistrationArgs[1].viewModel.instance).toBeInstanceOf(ViewModelConstructorBuilder)

    lifecycle.next()

    expect(ko.components.unregister).lastCalledWith(componentId)
  })

  test('initializes DataModel properties on ViewModel', async () => {
    ko.components.register = jest.fn()

    class DataModel extends DataModelConstructorBuilder<{}> {
      public async fetch() {
        // force this to sleep so it will actually fail
        await new Promise((resolve) => setTimeout(resolve, 500))
        return { foo: 'bar' }
      }
    }

    const getComponent = () => ({
      template: Promise.resolve({ default: 'Hello, World!' }),
      viewModel: Promise.resolve({
        default: class extends ViewModelConstructorBuilder {
          public data = new DataModel({})
        }
      })
    })

    const queue = jest.fn()
    const middleware = createComponentMiddleware(getComponent)
    const ctx = { queue: queue as any, route: {} } as Context
    const lifecycle = middleware(ctx)

    lifecycle.next()

    await queue.mock.calls[0][0]

    const instance = (ko.components.register as jest.Mock).mock.calls[0][1].viewModel.instance

    expect(instance.data.foo()).toBe('bar')
  })
})
