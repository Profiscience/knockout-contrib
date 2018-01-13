export const start = jest.fn(() => Promise.resolve())
export const finish = jest.fn(() => Promise.resolve())

let _initializedWith: any
export function initializedWith() {
  return _initializedWith
}

export function reset() {
  start.mockClear()
  start.mockImplementation(() => Promise.resolve())
  finish.mockClear()
  finish.mockImplementation(() => Promise.resolve())
}

export class ToProgress {
  public start = start
  public finish = finish
  constructor(opts: any) {
    _initializedWith = opts
  }
}
