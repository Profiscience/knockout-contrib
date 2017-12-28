import random from 'lodash/random'
import * as ko from 'knockout'
import * as ToProgress from 'toprogress'
import { Context, IContext, Middleware, Router } from '@profiscience/knockout-contrib-router'
import './views/foo'
import './views/bar'
import template from './index.html'

function createLoadingMiddleware(isLoading: KnockoutObservable<boolean>): Middleware {
  let loadingBar: ToProgress
  let loadingBarInterval: NodeJS.Timer

  return function*(ctx: Context & IContext) {
      // run once for top-most router
      if (!loadingBar) {
        // toggle overlay (observable passed in)
        LOADING(true)

        // start loading bar
        loadingBar = new ToProgress({
          color: '#000',
          duration: 0.2,
          height: '5px'
        })
        loadingBarInterval = setInterval(() => {
          loadingBar.increase(1)
        }, 100)
      }

      yield

      // end loading in bottom-most router afterRender
      if (!ctx.$child) {
        loadingBar.finish()
        clearInterval(loadingBarInterval)
        LOADING(false)
        // reset for next navigation
        loadingBar = null
        loadingBarInterval = null
      }
  }
}

const LOADING = ko.observable(true)

// pass loading observable into middleware factory
Router.use(createLoadingMiddleware(LOADING))

Router.useRoutes({
  '/': (ctx) => ctx.redirect('/foo'),

  // simulate a deeply nested route w/ timeouts (would be ajax or what have you
  // in real life)
  '/foo': [
    randomTimeout,
    {
      '/': [
        randomTimeout,
        {
          '/': [
            randomTimeout,
            {
              '/': [
                randomTimeout,
                {
                  '/': [
                    randomTimeout,
                    {
                      '/': 'foo'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '/bar': 'bar'
})

class ViewModel {
  public isLoading = LOADING
}

async function randomTimeout() {
  await new Promise((resolve) => setTimeout(resolve, random(1000)))
}

ko.components.register('loading-animation', { viewModel: ViewModel, template })
