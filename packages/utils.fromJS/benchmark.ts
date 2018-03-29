#!/usr/bin/env ts-node

import * as ko from 'knockout'
import * as benchmark from 'benchmark'
import 'knockout-mapping'
import { padEnd } from 'lodash'
import fromJS from './index'

const obj = {
  foo: {
    bar: {
      baz: {
        qux: true
      }
    }
  },
  foos: [
    { foo: true },
    { bar: true },
    { baz: true },
    { qux: true }
  ]
}

const suite = new benchmark.Suite()

suite
  .add(padEnd('utils.fromJS', 30), () => {
    fromJS({ ...obj })
  })
  .add(padEnd('utils.fromJS (deep arrays)', 30), () => {
    fromJS({ ...obj }, true)
  })
  .add(padEnd('mapping.fromJS', 30), () => {
    (ko as any).mapping.fromJS({ ...obj })
  })
  .on('cycle', (e) => {
    if (e.target.error) {
      console.error(e.target.error)
      process.exit(1)
      return
    }
    console.log(e.target.toString())
  })
  .run()