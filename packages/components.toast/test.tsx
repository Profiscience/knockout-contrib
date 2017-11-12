import { h } from 'jsx-dom'
import * as ko from 'knockout'

import './src' // tree-shaking
import Toast from './src'

describe('components.toast', () => {
  test('registers <knockout-contrib-toast /> component', () => {
    expect(ko.components.isRegistered('knockout-contrib-toast')).toBe(true)
  })

  test('create and dispose toasts', () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = () => $el.querySelector('.toast')

    ko.applyBindings({}, $el)
    ko.tasks.runEarly()
    
    expect(getToast()).toBeFalsy()

    const t = Toast.success('')
    expect(getToast()).toBeTruthy()

    t.dispose()
    expect(getToast()).toBeFalsy()    
  })

  test('binds toast-${index} class', () => {
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
    expect(getToast(1)).toBeFalsy()

    t2.dispose()
    expect(getToast(0)).toBeFalsy()    
  })

  test('binds toast-${type} class', () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = (i, t) => $el.querySelector(`.toast.toast-${i}.toast-${t}`)
    
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
  })

  test('binds text', () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const t = Toast.success('gucci mane')

    ko.applyBindings({}, $el)
    ko.tasks.runEarly()

    let $text = $el.querySelector('.toast-text')

    expect($text.innerHTML).toBe('gucci mane')

    t.dispose()
  })

  test('disposes when toast-close is clicked', () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = () => $el.querySelector(`.toast`)
    
    ko.applyBindings({}, $el)
    ko.tasks.runEarly()
    
    Toast.success('text')

    const $close = $el.querySelector('.toast-close') as HTMLElement
    $close.click()

    expect(getToast()).toBeFalsy()
  })

  test('disposes after 5 seconds', () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = () => $el.querySelector(`.toast`)
    
    ko.applyBindings({}, $el)
    ko.tasks.runEarly()
    
    jest.useFakeTimers()
    
    Toast.success('text')

    jest.runAllTimers()

    expect(getToast()).toBeFalsy()
  })

  test('mouseover stops timeout, mouseout resumes', () => {
    const $el = <knockout-contrib-toast></knockout-contrib-toast>
    const getToast = () => $el.querySelector(`.toast`) as HTMLElement
    
    ko.applyBindings({}, $el)
    ko.tasks.runEarly()
    
    Toast.success('text')

    $el.querySelector(`.toast-container`).dispatchEvent(new Event('mouseover'))

    jest.runAllTimers()
    expect(getToast()).toBeTruthy()

    $el.querySelector(`.toast-container`).dispatchEvent(new Event('mouseout'))

    jest.runAllTimers()
    expect(getToast()).toBeFalsy()
  })
})