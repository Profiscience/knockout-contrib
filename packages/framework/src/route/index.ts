import * as ko from 'knockout'
import { Context, IContext, Route } from '@profiscience/knockout-contrib-router'
import { componentPlugin } from './component'
import { componentsPlugin } from './components'

Route
  .usePlugin(componentPlugin)
  .usePlugin(componentsPlugin)
