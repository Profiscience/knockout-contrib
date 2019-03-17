import { repeat } from 'lodash'
import { Observable } from 'rxjs'

export function promisifyStream(stream: NodeJS.ReadableStream) {
  return new Promise<void>((resolve, reject) =>
    stream.on('end', resolve).on('error', reject)
  )
}

export function promisifyObservable(obs: Observable<any>) {
  return new Promise<void>((resolve, reject) =>
    obs.subscribe({
      next() {
        /* noop */
      },
      error(err) {
        reject(err)
      },
      complete() {
        resolve()
      }
    })
  )
}

export function createProgressBar(percent: number) {
  const size: number = (process.stdout as any).columns - 50

  const filled = Math.ceil(size * percent)
  const empty = size - filled - 2

  return `[${repeat('=', filled)}${repeat('-', empty)}]`
}

export function isURL(x: string) {
  return x.match(/^https?/)
}
