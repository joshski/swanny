const freshRequire = require('./freshRequire')
const join = require('path').join

const fs = require('fs')

const liveReload = fs.readFileSync(join(__dirname, './livereload.js'))
const contentPath = join(process.cwd(), 'content')
const extensionsPath = join(process.cwd(), 'extensions')
const layoutsPath = join(process.cwd(), 'layouts')

module.exports = class App {
  constructor({ injectReload }) {
    this.injectReload = injectReload
  }

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
    const contentPath = this.inferContentPath(path, extensions)
    const matchingExtensions = extensions.filter(ext => new RegExp('\.' + ext + '$').test(contentPath))
    if (matchingExtensions.length != 1) throw new Error('Expected 1 matching extension')
    const extensionModule = freshRequire(join(extensionsPath, matchingExtensions[0]))
    const moduleResult = extensionModule(contentPath)
    const rendering = moduleResult.layout ?
      freshRequire(join(layoutsPath, moduleResult.layout))(moduleResult.content) : moduleResult
    if (this.injectReload && rendering.contentType == 'text/html')
      rendering.body = rendering.body.replace('</body>', '<script src="/livereload.js"></s' + 'cript></body>')
    return rendering
  }

  inferContentPath(path, extensions) {
    const extensionMatch = extensions.find(ext => new RegExp('\.' + ext + '$').test(path))
    const candidates = extensions
      .map(ext => path + '.' + ext)
      .concat(extensions.map(ext => path + '/index.' + ext))
      .map(p => join(contentPath, p.slice(1)))
      .sort((a, b) => a.length - b.length)

    if (extensionMatch) {
      candidates.unshift(join(contentPath, path))
    }

    const matches = candidates.filter(candidate => fs.existsSync(candidate))
    if (matches.length != 1)
      throw new Error('Expected 1 content file matching path=' + path
        + ', found ' + matches.length + ': ' + matches.join('\n') + '\n' +
        'tried:\n' + candidates.join('\n'))

    return matches[0]
  }
}
