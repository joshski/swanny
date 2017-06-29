const hyperdom = require('hyperdom')
const marked = require('marked')
const fs = require('fs')

module.exports = path => {
  return {
    layout: 'page',
    content: class MarkdownPage {
      pageContent () {
        return hyperdom.rawHtml('.md', marked(fs.readFileSync(path, 'utf-8')))
      }
    }
  }
}
