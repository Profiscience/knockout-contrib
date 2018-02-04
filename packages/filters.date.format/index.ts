import * as ko from 'knockout'
import { format as formatDate } from 'date-fns'

export type DateFilterOptions = {
  additionalDigits?: 0 | 1 | 2
  locale?: any
}

export default (value: Date | KnockoutObservable<Date>, format: string, options?: DateFilterOptions) =>
  formatDate(ko.unwrap(value), format, options)
