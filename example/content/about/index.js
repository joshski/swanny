module.exports = class About {
  title () {
    return 'About us'
  }

  body (h) {
    return [
      'This is the ',
      h('strong', 'about us'),
      ' page, featuring a swan:',
      h('br'),
      h('img', { src: '/images/swan.jpg' })
    ]
  }
}
