const freshRequire = require('./freshRequire')
const join = require('path').join
const toHtml = require('hyperdom/toHtml')
const fs = require('fs')
const liveReload = fs.readFileSync(join(__dirname, 'node_modules/livereload-js/dist/livereload.js'))

module.exports = class App {
  respondTo({ path }) {
    if (path == '/livereload.js') {
      return {
        statusCode: 200,
        body: liveReload,
        contentType: 'application/javascript'
      }
    }
    const routePath = join(process.cwd(), 'routes', path)
    try {
      const Page = freshRequire(join(process.cwd(), 'page'))
      const routeModule = freshRequire(routePath)
      if (typeof routeModule.statusCode == 'number')
        return routeModule
      if (typeof routeModule == 'string')
        return {
          contentType: 'text/plain',
          body: routeModule
        }
      if (routeModule.length == 0)
        return new routeModule().render()
      const ViewClass = routeModule(Page)
      const view = new ViewClass()
      const renderedView = view.render()
      if (typeof renderedView.statusCode == 'number')
        return renderedView
      else
        return {
          statusCode: 200,
          body: toHtml(renderedView).replace('</body>', '<script src="/livereload.js"></s' + 'cript></body>'),
          contentType: 'text/html'
        }
    } catch (e) {
      return {
        statusCode: e.code == 'MODULE_NOT_FOUND' ? 404 : 500,
        body: e.stack,
        contentType: 'text/plain'
      }
    }
  }
}
