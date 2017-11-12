import { h } from 'jsx-dom'
import 'knockout-punches'
import * as ko from 'knockout'
import { addDays, subDays, addWeeks, subWeeks } from 'date-fns'

import './index'

(ko as any).punches.enableAll()

describe('filters.fromNow', () => {
  
  test('tomorrow', () => {
    const date = addDays(new Date(), 1)
    const el = <span data-bind='text: date | fromNow'></span>
    ko.applyBindings({ date }, el)
    expect(el.innerHTML).toBe('tomorrow')
  })

  test('yesterday', () => {
    const date = subDays(new Date(), 1)
    const el = <span data-bind='text: date | fromNow'></span>
    ko.applyBindings({ date }, el)
    expect(el.innerHTML).toBe('yesterday')
  })

  test('in 3 days', () => {
    const date = addDays(new Date(), 3)
    const el = <span data-bind='text: date | fromNow'></span>
    ko.applyBindings({ date }, el)
    expect(el.innerHTML).toBe('in 3 days')
  })

  test('3 days ago', () => {
    const date = subDays(new Date(), 3)
    const el = <span data-bind='text: date | fromNow'></span>
    ko.applyBindings({ date }, el)
    expect(el.innerHTML).toBe('3 days ago')
  })

  test('in 3 weeks', () => {
    const date = addWeeks(new Date(), 3)
    const el = <span data-bind='text: date | fromNow'></span>
    ko.applyBindings({ date }, el)
    expect(el.innerHTML).toBe('in 3 weeks')
  })

  test('3 weeks ago', () => {
    const date = subWeeks(new Date(), 3)
    const el = <span data-bind='text: date | fromNow'></span>
    ko.applyBindings({ date }, el)
    expect(el.innerHTML).toBe('3 weeks ago')
  })
})