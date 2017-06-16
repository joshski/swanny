const hyperdom = require('hyperdom')
const marked = require('marked')
const fs = require('fs')

module.exports = path => {
  return {
    layout: 'default',
    content: class MarkdownPage {
      body () {
        return hyperdom.rawHtml('.md', marked(fs.readFileSync(path, 'utf-8')))
      }
    }
  }
}
