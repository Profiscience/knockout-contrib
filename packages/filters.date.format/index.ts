import * as ko from 'knockout'
import { format as formatDate } from 'date-fns'

export function formatDateFilter(
  value: Date | ko.Observable<Date>,
  format: string
) {
  return formatDate(ko.unwrap(value), format)
}
