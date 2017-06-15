var resolve = require('resolve')
var caller = require('caller')
var pathUtils = require('path')
var fs = require('fs')
var chokidar = require('chokidar')

var requireCache = {}

module.exports = function(module) {
  var path = fs.realpathSync(resolve.sync(module, {basedir: pathUtils.dirname(caller()), extensions: Object.keys(require.extensions)}))
  var previousRequire = requireCache[path]
  var exports = require(path)

  var watcher = chokidar.watch()
  var deps = dependencies(path)

  if (!previousRequire || previousRequire.exports !== exports) {
    if (previousRequire) {
      previousRequire.watcher.close()
    }

    var depsByPath = {}
    deps.forEach(dep => {
      watcher.add(dep.path)
      depsByPath[dep.path] = dep
    })

    watcher.on('change', path => {
      var dep = depsByPath[path]

      dep.requirePath.forEach(path => {
        delete require.cache[path]
      })
    })
  }

  requireCache[path] = { watcher, exports }

  return exports
}

function dependencies(path) {
  var files = new Set()
  var deps = []

  function recurse(path, _requirePath) {
    if (!files.has(path)) {
      files.add(path)
      var entry = require.cache[path]
      if (entry) {
        var requirePath = _requirePath.concat([path])
        deps.push({ path, requirePath })
        entry.children.forEach(module => recurse(module.id, requirePath))
      }
    }
  }

  recurse(path, [])

  return deps
}
