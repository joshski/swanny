const freshRequire = require('../../freshRequire')

module.exports = path => {
  return {
    layout: 'default',
    content: freshRequire(path)
  }
}
