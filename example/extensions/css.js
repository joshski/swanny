const marked = require('marked')
const fs = require('fs')

module.exports = path => {
  return {
    contentType: 'text/css',
    body: fs.readFileSync(path, 'utf-8')
  }
}
