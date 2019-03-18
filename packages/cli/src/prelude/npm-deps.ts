import * as path from 'path'
import { spawn, StdioOptions } from 'child_process'

const rootPath = path.resolve(__dirname, '../../..')

const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'

const ansiClearLine = '\u001b[1000D\u001b[0K'
const ansiYellowForeground = '\u001b[33m'
const ansiDefaultForeground = '\u001b[39m'
const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export async function ensureNpmDeps() {
  let i = 0
  let logLine = 'Checking node_modules integrity...'
  let interval

  if (process.stdout.isTTY) {
    interval = setInterval(() => {
      i = (i + 1) % spinner.length
      process.stdout.write(ansiClearLine)
      process.stdout.write(
        `${ansiYellowForeground}${
          spinner[i]
        }${ansiDefaultForeground} ${logLine}`
      )
    }, 100)
  }

  const upToDate = await checkIntegrity()
  if (!upToDate) {
    logLine =
      'Dependency integrity check failed... reinstalling node_modules...'
    process.exit()
    const proc = yarnInstall()
    await new Promise((resolve, reject) =>
      proc.on('exit', (code) =>
        code === 0 ? resolve() : reject('Error installing dependencies')
      )
    )
  }

  if (process.stdout.isTTY && interval) {
    clearInterval(interval)
    process.stdout.write(ansiClearLine)
  }
}

export function yarnInstall() {
  const stdio: StdioOptions = process.stdout.isTTY
    ? ['ignore', 'pipe', 'ignore']
    : 'inherit'

  const proc = spawn(yarn, ['install'], {
    cwd: rootPath,
    stdio
  })

  return proc
}

async function checkIntegrity() {
  return await yarnIntegrityCheck()
}

async function yarnIntegrityCheck() {
  const stdio = process.stdout.isTTY ? 'ignore' : 'inherit'

  const proc = spawn(yarn, ['check', '--integrity'], {
    cwd: rootPath,
    stdio
  })

  return await new Promise((resolve) =>
    proc.on('exit', (code) => (code === 0 ? resolve(true) : resolve(false)))
  )
}
