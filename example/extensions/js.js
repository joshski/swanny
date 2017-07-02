const freshRequire = require('../../lib/freshRequire')

module.exports = path => {
  const content = freshRequire(path)
  return {
    layout: content.layout || 'page',
    content: content
  }
}
