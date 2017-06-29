module.exports = class Link {
  title () {
    return 'A page linked from the home page'
  }

  pageContent (h) {
    return [
      h('p', 'Not much to see here except a swan:'),
      h('img', { src: '/images/swan.jpg' }),
      h('p', h('a', { href: '/' }, 'kthxbye!'))
    ]
  }
}
