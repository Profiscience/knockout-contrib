import * as ko from 'knockout'
import '@profiscience/knockout-contrib-components/lazy'
import { LazyComponentLoader } from '@profiscience/knockout-contrib-components/loader'

// @ts-ignore
import manifest from '@profiscience/knockout-contrib-framework/build/COMPONENT_MANIFEST'

export function initialize() {
  ko.components.loaders.unshift(new LazyComponentLoader(manifest as any))
}
