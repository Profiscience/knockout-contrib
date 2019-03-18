# Tasks

This directory contains the UniversitySite CLI for running various tasks such as building, deploying, testing, etc.

## Usage

The simplest way to invoke the CLI is via [package.json run scripts][pkg-run-scripts].

From the project directory, use [yarn][] to run the package scripts (listed under the `scripts` property in [../package.json](../package.json))...

```
$ yarn build --production
```

## Commands

To see all available commands, use...

```
$ yarn run help
```

> **NOTE**: When invoking via yarn, to avoid confilcts with yarn's built-in help command, you must use the `run` keyword. Under the hood, this calls `node Tasks --help`.

Additionally, you may append `--help` to any command to see usage and available options, e.g. `yarn build --help`

## Configuration

**NOTE**: _Most_ commands will work without configuration with a standard UniversitySite development setup.

### Via CLI

It is recommended to use the CLI to get/set configuration values. To see all configurable values, use...

```
$ yarn config:get
```

To set a property, use `config:set` with dot-notation, e.g...

```
$ yarn config:set deploy.iis.hostname alpha2016.universitysite.com
```

Where applicable, the CLI will validate configuration values to avoid runtime errors.

### Via `config.json`

Configuration may also be set in `Tasks/config.json` (.gitignored'd, you'll have to create it). Available configuration options are defined in `lib/config.ts`.

## Using a RAM Disk

The folders for caches as well as temp files are located at `$TMPDIR/UniversitySiteBuild`.

Each build configuration (dev, compat, prod) maintains it's own separate cache, and they can grow quite large — at least as big as the `Client` folder itself. A 2GB — or larger — RAM disk is recommended to prevent build failures.

To use a RAM disk, create one using a tool such as [SoftPerfect RAMDisk][], then set the temp directory used by the build process by setting it in config.json or using the cli...

```
$ yarn config:set tmp R:\\
```

## Developing

You may have noticed that the CLI is written in TypeScript; because of this, the build tasks
themselves must be built. The easiest way to develop build tasks is by running `tsc -w` in this
directory. You may also run `yarn build:tasks` from the root directory.

The dist files are commited to the repo, so you only have to build these if making changes.

[yarn]: https://yarnpkg.com/en/
[pkg-run-scripts]: https://docs.npmjs.com/misc/scripts
[softperfect ramdisk]: https://www.softperfect.com/products/ramdisk/
