import * as ko from 'knockout'
import '@profiscience/knockout-contrib-components/flash-message'
import { flashMessage } from '@profiscience/knockout-contrib-router-middleware-flash-message'
;(window as any).flashMessage = flashMessage

flashMessage('This is a flash message!')

ko.applyBindings()
