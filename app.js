const freshRequire = require('./freshRequire')
const join = require('path').join

const fs = require('fs')

const liveReload = fs.readFileSync(join(__dirname, 'node_modules/livereload-js/dist/livereload.js'))
const routesPath = join(process.cwd(), 'routes')
const extensionsPath = join(process.cwd(), 'extensions')
const layoutsPath = join(process.cwd(), 'layouts')

module.exports = class App {
  respondTo({ path }) {
    if (path == '/livereload.js') { return { body: liveReload, contentType: 'application/javascript' } }
    try {
      return this.respondToRoute(path)
    } catch (e) {
      return {
        statusCode: e.code == 'MODULE_NOT_FOUND' ? 404 : 500,
        body: e.stack,
        contentType: 'text/plain'
      }
    }
  }

  respondToRoute(path) {
    const extensions = fs.readdirSync(extensionsPath)
      .map(ext => ext.replace(/\.js$/, '')).sort((a, b) => a.length - b.length)
    const routePath = this.inferRoutePath(path, extensions)
    const matchingExtensions = extensions.filter(ext => new RegExp('\.' + ext + '$').test(routePath))
    if (matchingExtensions.length != 1) throw new Error('Expected 1 matching extension')
    const extensionModule = freshRequire(join(extensionsPath, matchingExtensions[0]))
    const moduleResult = extensionModule(routePath)
    const rendering = moduleResult.layout ?
      freshRequire(join(layoutsPath, moduleResult.layout))(moduleResult.content) : moduleResult
    if (rendering.contentType == 'text/html')
      rendering.body = rendering.body.replace('</body>', '<script src="/livereload.js"></s' + 'cript></body>')
    return rendering
  }

  inferRoutePath(path, extensions) {
    const candidates = extensions
      .map(ext => path + '.' + ext)
      .concat(extensions.map(ext => path + '/index.' + ext))
      .map(p => join(routesPath, p.slice(1)))
      .sort((a, b) => a.length - b.length)
    const matches = candidates.filter(candidate => fs.existsSync(candidate))
    if (matches.length != 1)
      throw new Error('Expected 1 matching route, found ' + matches.length + ': ' + matches.join(', '))

    return matches[0]
  }
}
