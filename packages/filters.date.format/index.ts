import * as ko from 'knockout'
import { format as formatDate } from 'date-fns'

export function formatDateFilter(
  value: Date | ko.Observable<Date>,
  format: string
) {
  return formatDate(ko.unwrap(value), format, {
    // see https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
    useAdditionalDayOfYearTokens: true,
    useAdditionalWeekYearTokens: true,
  } as any)
}
