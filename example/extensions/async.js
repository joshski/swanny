const fs = require('fs')

module.exports = path => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({
        contentType: 'text/plain',
        body: fs.readFileSync(path, 'utf-8')
      })
    }, 1000)
  })
}
