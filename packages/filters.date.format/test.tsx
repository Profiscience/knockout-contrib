import { h } from 'jsx-dom'
import ko from 'knockout' // must use synthetic imports for punches
import 'knockout-punches'
import 'jest-jquery-matchers' // type defs
jest.addMatchers(require('jest-jquery-matchers')) // tslint:disable-line no-var-requires

import dateFilter from './index'

(ko as any).filters['date.format'] = dateFilter;
(ko as any).punches.enableAll()

describe('fiters.date', () => {
  test('formats date', () => {
    const el = <div data-bind='text: date | date.format:"MM_DD_YYYY"'></div>
    ko.applyBindings({ date: new Date(0) }, el)
    expect(el).toHaveText('12_31_1969')
  })

  test('works with observable', () => {
    const el = <div data-bind='text: date | date.format:"MM_DD_YYYY"'></div>
    ko.applyBindings({ date: ko.observable(new Date(0)) }, el)
    expect(el).toHaveText('12_31_1969')
  })
})
