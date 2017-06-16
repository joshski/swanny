const freshRequire = require('../../lib/freshRequire')

module.exports = path => {
  return {
    layout: 'default',
    content: freshRequire(path)
  }
}
