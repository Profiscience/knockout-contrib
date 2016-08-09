import ko from 'knockout'

import cast from './cast'
import defaults from './defaults'
import fromJS from './fromJS'
import merge from './merge'
import './increment'
import './subscribeOnce'
import './toString'

ko.utils.cast = cast
ko.utils.defaults = defaults
ko.utils.fromJS = fromJS
ko.utils.merge = merge

export {
  cast,
  defaults,
  fromJS,
  merge
}
