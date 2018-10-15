#! node_modules/.bin/ts-node

import { fork, ChildProcess } from 'child_process'
import * as os from 'os'
import * as path from 'path'
import * as chokidar from 'chokidar'
import globby from 'globby'
import chalk from 'chalk'

const argv = parseArgv()
const PACKAGES_DIR = path.resolve(__dirname, 'packages')
const workers = createWorkers(Math.max(Math.min(os.cpus().length - 2, 8), 1))

function parseArgv() {
  const hasFlag = (f: string) =>
    process.argv.indexOf(`--${f}`) > -1 || process.argv.indexOf(`-${f[0]}`) > -1
  return {
    watch: hasFlag('watch'),
    transpileOnly: hasFlag('transpile-only')
  }
}

const getSourceFiles = () =>
  globby(
    [
      '**/*.ts',
      '**/*.tsx',
      '!**/examples/**/*',
      '!**/node_modules/**/*',
      '!**/__tests__/**/*',
      '!**/test.ts',
      '!**/test.tsx',
      '!**/*.test.ts'
    ],
    {
      cwd: PACKAGES_DIR
    }
  ).then((files) => files.map((f) => path.resolve(__dirname, 'packages', f)))

function createWorkers(size: number) {
  // tslint:disable no-console
  console.info(chalk.cyan(`Forking ${size} worker processess`))
  const workerFile = path.resolve(__dirname, './build.worker.ts')
  const _workers: ChildProcess[] = []
  let i = 0
  while (i++ < size) _workers.push(fork(workerFile))
  let numListeners = 0
  return {
    doWork(file: string) {
      const worker = _workers[i++ % size]
      const p = new Promise<{
        file: string
        hasErrors?: boolean
        hasWarnings?: boolean
      }>((resolve, reject) => {
        worker.setMaxListeners(++numListeners)

        worker.on('message', (message: any) => {
          if (file === message.file) {
            if (message.hasErrors) {
              reject(message)
            } else {
              resolve(message)
              console.log(chalk.dim(`Transpiled ${message.file}`))
            }
          }
        })
      })
      worker.send({ file })
      return p
    },
    cull(numToKeep: number) {
      for (let j = numToKeep; j < size; j++) {
        ;(_workers.pop() as ChildProcess).kill()
      }
      size = numToKeep
    },
    destroy() {
      _workers.forEach((w) => w.kill())
    }
  }
}

function pifyProc(proc: ChildProcess) {
  return new Promise<{ code: number; output: string }>((resolve, reject) => {
    let output = ''
    proc.stdout.on('data', (buf) => (output += buf.toString()))
    proc.on('close', (code) => resolve({ code, output }))
    proc.on('error', (err) => reject(err))
  })
}

function startTypeChecker() {
  // tslint:disable:no-console
  const args: string[] = ['--pretty']
  console.info(chalk.cyan('Forking type checker'))
  if (argv.watch) args.push('--watch')
  const proc = fork(
    path.resolve(__dirname, 'node_modules/typescript/bin/tsc'),
    args,
    { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] }
  )
  proc.stderr.pipe(process.stderr)
  proc.on('close', (code) => {
    const color = code === 0 ? chalk.green : chalk.red
    console.info(color(`\nType checker exited with code ${code}`))
  })
  return proc
}

async function build(files: string[]): Promise<number> {
  const [typeCheckResults, transpileAndLintResults] = await Promise.all<any>([
    argv.transpileOnly ? Promise.resolve() : pifyProc(startTypeChecker()),
    Promise.all(files.map(workers.doWork)).then((results) => {
      console.log(chalk.green('Transpilation completed without errors'))
      workers.destroy()
      return results
    })
    // .catch((message) => {
    //   console.error('Error:', message)
    // })
  ])
  if (typeCheckResults && typeCheckResults.output) {
    typeCheckResults.output
      .split('\n')
      .forEach((l: string) => console.error('[tsc]', l))
    return 1
  }
  if (transpileAndLintResults.find((r: any) => !!r.hasErrors)) {
    return 1
  }
  return 0
}

async function watch(files: string[]): Promise<number> {
  if (!argv.transpileOnly) {
    const typeChecker = startTypeChecker()
    typeChecker.stdout.on('data', (buf: Buffer) => {
      const str = buf.toString().replace('\u001Bc', '')
      str
        .split('\n')
        .filter((l) => l.length > 0)
        .map((l) => console.log('[tsc]', l))
    })
  }

  await Promise.all(files.map(workers.doWork))

  console.log('Initial build complete, scaling back workers')
  workers.cull(1)

  console.log('Watching for changes...')
  const watcher = chokidar.watch(files)
  watcher.on('change', (p) => {
    console.info('Change detected in', p)
    workers.doWork(p).catch(() => {
      /* noop */
    })
  })

  return new Promise<number>(() => {
    /* void */
  })
}

async function main() {
  const files = await getSourceFiles()
  if (argv.watch) {
    return await watch(files)
  } else {
    return await build(files)
  }
}

main()
  .catch((err) => {
    // tslint:disable:no-console
    if (err.message) console.error(err.message)
    return 1
  })
  .then((code: number) => {
    workers.destroy()
    process.exit(code)
  })
  .catch(() => {
    /* noop*/
  })
