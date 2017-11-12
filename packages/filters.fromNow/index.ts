import * as ko from 'knockout'
import ago from 's-ago'

(ko as any).filters.fromNow = function (_date) {
  let time = ko.unwrap(_date).getTime()
  const isPast = Date.now() > time
  if (!isPast) {
    time = Date.now() - (time - Date.now())
  }
  const relativeTime = ago(new Date(time))
  return isPast
    ? relativeTime
    : relativeTime === 'yesterday'
      ? 'tomorrow'
      : 'in ' + relativeTime.replace(' ago', '')
}
