import * as ko from 'knockout'

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeObservable(): boolean
    }
  }
}

expect.extend({
  toBeObservable(received) {
    if (ko.isObservable(received)) {
      return {
        pass: true,
        message: () => `expected ${received} not to be observable`
      }
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be observable`
      }
    }
  }
})
