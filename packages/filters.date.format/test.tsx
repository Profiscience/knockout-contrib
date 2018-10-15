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
    const el = <div data-bind="text: date | date.format:'yyyy_MM_dd'" />
    ko.applyBindings({ date: new Date(1970, 0, 1) }, el)
    expect(el).toHaveText('1970_01_01')
  })

  test('works with observable', () => {
    const el = <div data-bind="text: date | date.format:'yyyy_MM_dd'" />
    ko.applyBindings({ date: ko.observable(new Date(1970, 0, 1)) }, el)
    expect(el).toHaveText('1970_01_01')
  })

  // see https://gist.github.com/kossnocorp/a307a464760b405bb78ef5020a4ab136#changed
  test('allows D, DD, YY, and YYYY', () => {
    const el = <div data-bind="text: date | date.format:'D/DD/YY/YYYY'" />
    expect(() => {
      ko.applyBindings({ date: ko.observable(new Date(1970, 0, 1)) }, el)
    }).not.toThrow()
    expect(el).toHaveText('1/01/70/1970')
  })
})
