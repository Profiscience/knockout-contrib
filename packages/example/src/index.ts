import { App } from '@ali/runtime'
import { createTitleRoutePlugin } from '@profiscience/knockout-contrib'

const app = new App({
  routing: {
    plugins: [
      createTitleRoutePlugin((ts) => `Ali Example App | ${ts.join(' > ')}`)
    ]
  }
})

app.start()
