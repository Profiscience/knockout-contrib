import * as ko from 'knockout'
import throttle from 'lodash/throttle'

type InfiniteScrollBindingCallback = () => void | Promise<void>

type InfiniteScrollBindingOptions =
  | InfiniteScrollBindingCallback
  | {
      offset: number
      handler: InfiniteScrollBindingCallback
    }

export const infiniteScrollBindingHandler: ko.BindingHandler<InfiniteScrollBindingOptions> = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    const opts = valueAccessor()
    const { handler, offset } =
      typeof opts === 'function' ? { offset: 1500, handler: opts } : opts

    const $el = $(el)
    const $window = $(window)

    let prevScrolledDist = 0

    const handleScroll = throttle((e) => {
      const windowScrollTop = $window.scrollTop()
      const windowHeight = $window.height()

      if (
        typeof windowScrollTop === 'undefined' ||
        typeof windowHeight === 'undefined'
      ) {
        throw new Error(
          '[knockout-contrib/bindings.infiniteScroll]: Error calculating window scrolled distance'
        )
      }

      const scrolledDist = windowScrollTop + windowHeight

      if (scrolledDist < prevScrolledDist) {
        prevScrolledDist = scrolledDist
        return
      }
      prevScrolledDist = scrolledDist

      const elOffset = $el.offset()
      const elHeight = $el.outerHeight()

      if (typeof elOffset === 'undefined' || typeof elHeight === 'undefined') {
        throw new Error(
          '[knockout-contrib/bindings.infiniteScroll]: Error calculating element trigger point'
        )
      }
      const triggerPoint = elOffset.top - elHeight - offset

      if (scrolledDist < triggerPoint) return

      const promise: any | Promise<void> = handler.call(bindingContext.$data)

      disarmTrigger()

      if (promise && typeof promise.then === 'function') {
        promise.then(armTrigger).catch((err: Error) => {
          throw err
        })
      } else {
        requestAnimationFrame(armTrigger)
      }
    }, 300)

    function armTrigger() {
      document.addEventListener('scroll', handleScroll)
    }

    function disarmTrigger() {
      document.removeEventListener('scroll', handleScroll)
    }

    armTrigger()
    ko.utils.domNodeDisposal.addDisposeCallback(el, disarmTrigger)
  }
}
