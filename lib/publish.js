const App = require('./app')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const rmfr = require('rmfr')
const readDir = require('recursive-readdir')

const contentPath = path.join(process.cwd(), 'content')
const outputPath = path.join(process.cwd(), 'public')

readDir(contentPath, function (err, files) {
  rmfr(outputPath).then(() => {
    mkdirp.sync(outputPath)
    const app = new App({ injectReload: false })
    files.forEach(file => {
      const extensionLess = file.substr(contentPath.length).replace(/\.[^/.]+$/, '')
      const requestPath = extensionLess.replace(/\/index$/, '') || '/'
      const publicPath = path.join(outputPath, extensionLess.replace(/\/index$/, '/index.html').substr(1))
      const response = app.respondTo({ path: requestPath })
      mkdirp.sync(path.dirname(publicPath))
      fs.writeFileSync(publicPath, response.body)
    })
    process.exit(0)
  })
})
