import * as ko from 'knockout'
import * as benchmark from 'benchmark'
import 'knockout-mapping'
import { padEnd } from 'lodash'
import { fromJS } from './index'

const obj = {
  foo: {
    bar: {
      baz: {
        qux: true
      }
    }
  },
  foos: [{ foo: true }, { bar: true }, { baz: true }, { qux: true }]
}

const suite = new benchmark.Suite()

suite
  .add(padEnd('utils.fromJS', 40), () => {
    fromJS({ ...obj })
  })
  .add(padEnd('utils.fromJS (mapArrayElements)', 40), () => {
    fromJS({ ...obj }, true)
  })
  .add(padEnd('mapping.fromJS', 40), () => {
    ;(ko as any).mapping.fromJS({ ...obj })
  })
  .on('cycle', (e: any) => {
    // tslint:disable:no-console
    if (e.target.error) {
      console.error(e.target.error)
      process.exit(1)
      return
    }
    console.log(e.target.toString())
  })
  .run()
