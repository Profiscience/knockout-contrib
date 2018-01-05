import * as ko from 'knockout'
import { Context, IContext, Route } from '@profiscience/knockout-contrib-router'
import { childrenPlugin } from './children'
import { componentPlugin } from './component'
import { componentsPlugin } from './components'
import { titlePlugin } from './title'
import { withPlugin } from './with'

Route
  .usePlugin(withPlugin)
  .usePlugin(childrenPlugin)
  .usePlugin(componentPlugin)
  .usePlugin(componentsPlugin)
  .usePlugin(titlePlugin)
