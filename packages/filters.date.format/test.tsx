import { h } from 'jsx-dom'
import ko from 'knockout' // must use synthetic imports for punches
import 'knockout-punches'
import 'jest-jquery-matchers' // type defs
jest.addMatchers(require('jest-jquery-matchers')) // tslint:disable-line no-var-requires

import { formatDateFilter } from './index'
;(ko as any).filters['date.format'] = formatDateFilter
;(ko as any).punches.enableAll()

describe('fiters.date', () => {
  test('formats date', () => {
    const el = <div data-bind="text: date | date.format:'YYYY_M_D'" />
    ko.applyBindings({ date: new Date(1970, 0, 1) }, el)
    expect(el).toHaveText('1970_1_1')
  })

  test('works with observable', () => {
    const el = <div data-bind="text: date | date.format:'YYYY_M_D'" />
    ko.applyBindings({ date: ko.observable(new Date(1970, 0, 1)) }, el)
    expect(el).toHaveText('1970_1_1')
  })
})
