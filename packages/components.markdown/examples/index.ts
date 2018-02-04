import * as ko from 'knockout'
import { IMarkdownParams } from '@profiscience/knockout-contrib-components/markdown' // typedef ONLY
import '@profiscience/knockout-contrib-components/markdown' // side-effects

const params: IMarkdownParams = {}

ko.applyBindings({ params })
