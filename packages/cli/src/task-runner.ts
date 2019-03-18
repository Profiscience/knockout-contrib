import { extend } from 'lodash'
// @ts-ignore
import Listr from 'listr'
import { Observable } from 'rxjs'
// @ts-ignore
import SilentRenderer from 'listr-silent-renderer'
import { IRawOutput, RawReporter, Reporter } from './reporters'

export interface ITaskRunnerOptions {
  concurrent?: boolean
  verbose?: boolean | string
  json?: string
  silent?: boolean
  raw?: (output: IRawOutput) => void | Promise<void>
}

interface ITask {
  title: string
  skip?: (context: any) => void | string
  task(
    context: any
  ): Listr | Promise<void> | Observable<any> | NodeJS.ReadWriteStream | void
}

export class TaskRunner extends Listr {
  constructor(tasks: ITask[], opts: ITaskRunnerOptions = {}) {
    const renderer = getRenderer(opts)

    super(
      tasks,
      extend(opts, {
        renderer,
        nonTTYRenderer: renderer
      })
    )
  }

  public async run() {
    await super.run()
  }
}

function getRenderer(opts: ITaskRunnerOptions) {
  if (opts.silent) {
    return SilentRenderer
  }
  if (opts.raw) {
    const raw = opts.raw.bind(opts.raw)
    // tslint:disable-next-line:max-classes-per-file
    return class extends RawReporter {
      public update(v: any) {
        raw(v)
      }
    }
  }
  return Reporter
}
