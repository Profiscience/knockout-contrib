import ko from 'knockout'

export default function cast(src, defaultValue) {
  if (isUndefined(src)) {
    src = ko.observable()
  }

  if (isUndefined(src()) && defaultValue) {
    src(defaultValue)
  }

  return src
}

function isUndefined(foo) {
  return typeof foo === 'undefined'
}
