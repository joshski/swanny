const page = require('./page')

module.exports = event => {
  class EventPage {
    pageContent(h) {
      return [
        h('h1', 'Event: ', event.name),
        h('p', event.description),
        h('a', { href: '/' }, 'Got it!')
      ]
    }
  }
  return page(EventPage)
}
