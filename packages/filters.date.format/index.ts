import * as ko from 'knockout'
import { format as formatDate } from 'date-fns'

export function formatDateFilter(
  value: Date | ko.Observable<Date>,
  format: string
) {
  return formatDate(ko.unwrap(value), format, {
    awareOfUnicodeTokens: true // see https://gist.github.com/kossnocorp/a307a464760b405bb78ef5020a4ab136#changed
  } as any)
}
