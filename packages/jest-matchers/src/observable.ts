import * as ko from 'knockout'

declare global {
  namespace jest {
    // tslint:disable-next-line interface-name
    interface Matchers<R> {
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
