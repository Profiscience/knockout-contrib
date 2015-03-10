HashbangRouter  = require './lib/router/HashbangRouter'
PushstateRouter = require './lib/router/PushstateRouter'

###
Initializes the router

@param _ko {Knockout} ko context
@param routes {Object} routes object
@param options {Object} config object
@option basePath {String} path to route from
@option HTML5 {Boolean} whether or not pushstate routing should be used
###
start = (_ko, routes, options = {}) ->

  HTML5    = options.HTML5 ? false
  basePath = options.basePath ? ''

  Router = if HTML5 then PushstateRouter else HashbangRouter

  _ko.router = new Router(_ko, routes, basePath)
  _ko.components.register 'ko-component-router', require('./lib/component')(_ko)

module.exports = start: start