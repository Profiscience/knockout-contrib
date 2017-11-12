import { h } from 'jsx-dom'
import * as ko from 'knockout'

import './' // tree-shaking
import Toast from './'

describe('components.toast', () => {
  test('registers <knockout-contrib-toast /> component', () => {
    expect(ko.components.isRegistered('knockout-contrib-toast')).toBe(true)
  })

  test('create and dispose toasts', (done) => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = () => $el.querySelector('.toast')

    ko.applyBindings({}, $el)
    ko.tasks.runEarly()
    
    expect(getToast()).toBeFalsy()

    const t = Toast.success('')
    expect(getToast()).toBeTruthy()

    t.dispose()
    getToast().addEventListener('transitionend', () => {
      expect(getToast()).toBeFalsy()    
      done()
    })
    getToast().dispatchEvent(new Event('transitionend'))
  })

  test('binds toast-${index} class', async () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = (i) => $el.querySelector(`.toast.toast-${i}`)

    ko.applyBindings({}, $el)
    ko.tasks.runEarly()
    
    expect(getToast(0)).toBeFalsy()

    const t1 = Toast.success('text')
    expect(getToast(0)).toBeTruthy()

    const t2 = Toast.success('text')
    expect(getToast(1)).toBeTruthy()

    t1.dispose()
    await new Promise((resolve) => {
      getToast(0).addEventListener('transitionend', () => {
        expect(getToast(1)).toBeFalsy()
        resolve()
      })
      getToast(0).dispatchEvent(new Event('transitionend'))
    })

    t2.dispose()
    await new Promise((resolve) => {
      getToast(0).addEventListener('transitionend', () => {
        expect(getToast(0)).toBeFalsy()
        resolve()
      })
      getToast(0).dispatchEvent(new Event('transitionend'))
    })
  })

  test('binds toast-${type} class', async () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = (i, t = i) => $el.querySelector(`.toast.toast-${i}.toast-${t}`)
    
    ko.applyBindings({}, $el)
    ko.tasks.runEarly()

    const tSuccess = Toast.success('text')
    expect(getToast(0, 'success')).toBeTruthy()

    const tError = Toast.error('text')
    expect(getToast(1, 'error')).toBeTruthy()

    const tInfo = Toast.info('text')
    expect(getToast(2, 'info')).toBeTruthy()

    tSuccess.dispose()
    tError.dispose()
    tInfo.dispose()

    await new Promise((resolve) => {
      const t = getToast(0)
      t.addEventListener('transitionend', resolve)
      t.dispatchEvent(new Event('transitionend'))
    })
    await new Promise((resolve) => {
      const t = getToast(0)
      t.addEventListener('transitionend', resolve)
      t.dispatchEvent(new Event('transitionend'))
    })
    await new Promise((resolve) => {
      const t = getToast(0)
      t.addEventListener('transitionend', resolve)
      t.dispatchEvent(new Event('transitionend'))
    })
  })

  test('binds text', async () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const t = Toast.success('gucci mane')

    ko.applyBindings({}, $el)
    ko.tasks.runEarly()

    let $text = $el.querySelector('.toast-text')

    expect($text.innerHTML).toBe('gucci mane')

    t.dispose()

    await new Promise((resolve) => {
      const t = $el.querySelector('.toast-0')
      t.addEventListener('transitionend', resolve)
      t.dispatchEvent(new Event('transitionend'))
    })
  })

  test('disposes when toast-close is clicked', async () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = () => $el.querySelector(`.toast`)
    
    ko.applyBindings({}, $el)
    ko.tasks.runEarly()
    
    Toast.success('text')

    const $close = $el.querySelector('.toast-close') as HTMLElement
    $close.click()

    await new Promise((resolve) => {
      const t = getToast()
      t.addEventListener('transitionend', resolve)
      t.dispatchEvent(new Event('transitionend'))
    })

    expect(getToast()).toBeFalsy()
  })

  test('disposes after 5 seconds', async () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = () => $el.querySelector(`.toast`)
    
    ko.applyBindings({}, $el)
    ko.tasks.runEarly()
    
    jest.useFakeTimers()
    
    Toast.success('text')

    jest.runAllTimers()

    await new Promise((resolve) => {
      const t = getToast()
      t.addEventListener('transitionend', resolve)
      t.dispatchEvent(new Event('transitionend'))
    })

    expect(getToast()).toBeFalsy()
  })

  test('mouseover stops timeout, mouseout resumes', async () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = () => $el.querySelector(`.toast`) as HTMLElement
    
    ko.applyBindings({}, $el)
    ko.tasks.runEarly()

    jest.useFakeTimers()
    
    Toast.success('text')

    $el.querySelector(`.toast-container`).dispatchEvent(new Event('mouseover'))

    jest.runAllTimers()
    expect(getToast()).toBeTruthy()

    $el.querySelector(`.toast-container`).dispatchEvent(new Event('mouseout'))

    jest.runAllTimers()

    await new Promise((resolve) => {
      const t = getToast()
      t.addEventListener('transitionend', resolve)
      t.dispatchEvent(new Event('transitionend'))
    })

    expect(getToast()).toBeFalsy()
  })
})