const h = require('hyperdom').html

module.exports = class Page {
  render () {
    return h(
      'html',
      this.renderHead(h),
      this.renderBody(h)
    )
  }

  renderHead (h) {
    return h(
      'head',
      this.renderTitle(h),
      this.renderStylesheet(h)
    )
  }

  renderTitle (h) {
    return h('title', this.title())
  }

  renderStylesheet (h) {
    return h('link', { rel: 'stylesheet', href: '/style.css', type: 'text/css' })
  }

  title () {
    return 'Untitled'
  }

  renderBody (h) {
    return h('body', this.bodyContents(h))
  }

  bodyContents (h) {
    return '...'
  }
}
