import { createTitleRoutePlugin } from '@profiscience/knockout-contrib'
import { App } from '@ali/runtime'

const app = new App({
  plugins: [
    createTitleRoutePlugin((ts) => `Ali Example App | ${ts.join(' > ')}`)
  ]
})

app.start()
