import { Route } from '@profiscience/knockout-contrib'

export default new Route('/', {
  title: 'Home',
  component: () => ({
    template: import('./template.html')
  })
})
