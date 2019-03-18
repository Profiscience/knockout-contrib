const [major] = process.versions.node.split('.').map(parseFloat) // ¯\_(ツ)_/¯

const ansiBoldOn = '\u001b[1m'
const ansiBoldOff = '\u001b[22m'
const ansiRedForeground = '\u001b[31m'
const ansiDefaultForeground = '\u001b[39m'

if (major < 8) {
  process.stderr.write(`
${ansiRedForeground}NodeJS >= v8.9.0 required!${ansiDefaultForeground}

Install the latest release from https://nodejs.org/en/, or via your package manager of choice.

After changing node versions, you will likely encounter node-gyp errors.
The surest way to resolve this is to delete node_modules and reinstall.
`)
  process.exit(1)
}
