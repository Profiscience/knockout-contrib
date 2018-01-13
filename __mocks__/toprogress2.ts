export const start = jest.fn()
export const finish = jest.fn()

export function reset() {
  start.mockReset()
  finish.mockReset()
}

export class ToProgress {
  public start = start
  public finish = finish
}
