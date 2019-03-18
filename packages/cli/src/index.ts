#!/usr/bin/env node

import prelude from './prelude'

prelude
  .then(() => import('./cli'))
  .catch((err) => {
    process.stderr.write(err.message)
    process.exitCode = 1
  })
