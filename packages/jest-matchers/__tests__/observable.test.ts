import * as ko from 'knockout'
import '../src/observable'

const obs = ko.observable()
const notObs = {}

describe('jest-matchers toBeObservable', () => {
  test('passes when observable', () => {
    expect(obs).toBeObservable()
  })
  test('passes when negated and not observable', () => {
    expect(notObs).not.toBeObservable()
  })
  test('fails when not observable', () => {
    expect(() => expect(notObs).toBeObservable()).toThrow()
  })
  test('fails when negated and observable', () => {
    expect(() => expect(obs).not.toBeObservable()).toThrow()
  })
})
