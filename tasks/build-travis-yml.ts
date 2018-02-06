/* tslint:disable max-line-length */
import * as fs from 'fs'
import * as path from 'path'

const dirs = fs.readdirSync(path.resolve(__dirname, '../packages'))

const contents = `
language: node_js
node_js:
- stable
addons:
  firefox: latest
env:
  matrix:
  global:
  - TRAVIS=true
  - GK_LOCK_YARN_OPTS="--ignore-workspace-root-check"
  - DISPLAY=:99.0
  - secure: LHF20/U42BskU7ov0yH0PaOjOmVVP8kNwJTCVshOhEcJNJwTt1LvBSX7DxiIfxOntgLu0kZLIHjyPuESjeJYLP+1BlfACuXfg/CC2X9C1cbsoxbkF7vhpqIq7scEUW0h6d0OpxVzBzyjjYyxE14ct1KGVrylqnwrbAD5EsRPM3Byf5WFq1iMd2VWxvwn1KnluKm+7EklbsPC6X93ui7o8gDllwl55vZjw2a+JnymAoORbk5k07Vo4/5hRI4wLNEZ2hPD2FnWc30Tir/WrDU9/b/by+JLr8J+vTuAH13WdNRJ7oe1bggIahObEIj6D9RyjizO9EeUVNF7g64VbOK1aGWPYzGKCMojPadhs6rzkFoKCC6xWBMidfqKms3dkF0JE4GJVcKd0XO6AbGfdomK7TrQNh54jN4cpUhmEhGMAUS05qG9+hrCqiqVULm1A0TqFnZPzrm+jA7XLgxUk0CAYHfv17XgAdi9aeubmAD4vXAquSvPnbAiDQbH3B73k6Vk1V9fxiqu5NU83OPt8D0X+TiAhhEOIgMlCHpQr71NT3c0C1DbTFZvQmZ6LFdIz0hJwNVF+MJwnE4YUHGY0hjXbZndWfhksEtZuNlGmeEVlNrF9d6qEEfOpoeMxDDRuKO9GPk/A/lQSJXqommbhpMNBWGxlG2e5dK9liYt95UyOBI=
branches:
  only:
  - master
  - /^greenkeeper/.*$/
cache:
  yarn: true
  directories:
  - node_modules
  ${dirs.map((d) => '- ' + getDist(d)).join('\n  ')}
install:
- yarn install --ignore-optional
before_script:
- sh -e /etc/init.d/xvfb start
- npx -p greenkeeper-lockfile@1 greenkeeper-lockfile-update
script:
- yarn build --concurrency 1 --since $TRAVIS_BRANCH
- yarn test
- yarn test:router
after_script:
- npx codecov
- npx -p greenkeeper-lockfile@1 greenkeeper-lockfile-upload
notifications:
  email: false
`

fs.writeFileSync(path.resolve(__dirname, '../.travis.yml'), contents)

function getDist(pkgName: string) {
  const tsconfigPath = path.resolve(__dirname, '../packages', pkgName, 'tsconfig.json')
  const exists = fs.existsSync(tsconfigPath)
  return path.join(
    './packages',
    pkgName,
    exists
      ? require(path.resolve(__dirname, '../packages', pkgName, 'tsconfig.json')).compilerOptions.outDir
      : './'
  )
}
