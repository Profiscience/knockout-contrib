#!/usr/bin/env node

import prelude from './prelude'

prelude
  .then(() => require('./cli'))
  .catch((err) => {
    process.stderr.write(err.message)
    process.exit(1)
  })
