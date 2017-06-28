const fs = require('fs')

module.exports = path => {
  return {
    contentType: 'image/jpeg',
    body: fs.readFileSync(path)
  }
}
