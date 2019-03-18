import gulp from 'gulp'
import cache from 'gulp-cached'
import concat from 'gulp-concat'
// @ts-ignore
import cssmin from 'gulp-cssmin'
import _if from 'gulp-if'
// @ts-ignore
import postcss from 'gulp-postcss'
import remember from 'gulp-remember'
import { Observable } from 'rxjs'
import { ILongRunningTaskPayload } from './task-payload'

export function buildStyles(opts: {
  files: string[]
  production?: boolean
  watch?: boolean
  cacheId: string
  outFile: string
  outDir: string
}) {
  const build = () =>
    promisifyStream(
      gulp
        .src(opts.files, { allowEmpty: true })
        .pipe(_if(opts.watch as boolean, cache(opts.cacheId)))
        .pipe(postcss())
        .pipe(_if(opts.watch as boolean, remember(opts.cacheId)))
        .pipe(concat(opts.outFile))
        .pipe(_if(opts.production as boolean, cssmin()))
        .pipe(gulp.dest(opts.outDir))
    )

  if (opts.watch) {
    return new Observable<ILongRunningTaskPayload>((observer) => {
      observer.next({ status: 'working', message: 'building...' })
      build()
        .then(() => {
          observer.next({ status: 'ok' })
        })
        .catch(() => {
          /* noop */
        })

      gulp.watch(opts.files, async (e: any) => {
        if (e.type === 'deleted') {
          // @ts-ignore
          delete cache.caches[cacheId][e.path]
          remember.forget(opts.cacheId, e.path)
        }
        observer.next({
          status: 'working',
          message: `${e.path} ${e.type}... rebuilding...`
        })
        await build()
        observer.next({ status: 'ok', message: 'built' })
      })
    })
  } else {
    return build()
  }
}

function promisifyStream(stream: NodeJS.ReadableStream) {
  return new Promise<void>((resolve, reject) =>
    stream.on('end', resolve).on('error', reject)
  )
}
