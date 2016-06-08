import ko from 'knockout'

import defaults from './defaults'
import fromJS from './fromJS'
import merge from './merge'
import './increment'
import './toString'

merge(ko.utils, {
  defaults,
  fromJS,
  merge
})
