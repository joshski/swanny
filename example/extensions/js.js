const freshRequire = require('../../lib/freshRequire')

module.exports = path => {
  return {
    layout: 'page',
    content: freshRequire(path)
  }
}
