const h = require('hyperdom').html
const toHtml = require('hyperdom/toHtml')

module.exports = content => {
  Object.setPrototypeOf(content.prototype, Page.prototype)
  Object.setPrototypeOf(content, Page)
  return {
    contentType: 'text/html',
    body: toHtml(new content().render())
  }
}

class Page {
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
    return h(
      'body',
      this.renderHeader(h),
      this.body(h),
      this.renderFooter(h)
    )
  }

  renderHeader (h) {
    return h('header', this.header(h))
  }

  renderFooter (h) {
    return h('footer', this.footer(h))
  }

  body (h) {
    return []
  }

  header (h) {
    return []
  }

  footer (h) {
    return []
  }
}
