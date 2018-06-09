/**
 * This file provides a recommended starting point for using this repository
 * (https://github.com/Profiscience/knockout-contrib)
 *
 * Copy this to your project, and remove the pieces you don't need.
 *
 * **Don't'** change the knockout-contrib import statement to an `import *`
 * if you remove anything, otherwise you will not be able to take advantage of
 * tree-shaking.
 */

import * as ko from 'knockout'

import {
  // import bindings
  altClickBindingHandler,
  ctrlClickBindingHandler,
  metaClickBindingHandler,
  shiftClickBindingHandler
} from '@profiscience/knockout-contrib'

// register bindings
ko.bindingHandlers['click.alt'] = altClickBindingHandler
ko.bindingHandlers['click.ctrl'] = ctrlClickBindingHandler
ko.bindingHandlers['click.meta'] = metaClickBindingHandler
ko.bindingHandlers['click.shift'] = shiftClickBindingHandler
