import yargs from 'yargs'

import { buildCommand } from './commands/build'
import { serveCommand } from './commands/serve'

export const { argv } = yargs
  .demandCommand(1)
  .command(buildCommand)
  .command(serveCommand)
