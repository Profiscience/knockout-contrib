'use strict'

Object.assign(exports, require('./tasks/build'))
Object.assign(exports, require('./tasks/_transpile'))
Object.assign(exports, require('./tasks/_styles'))

// optional dependencies
try {
  Object.assign(exports, require('./tasks/examples'))
  Object.assign(exports, require('./tasks/watch'))
} catch (e) {
  // noop
}