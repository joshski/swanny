module.exports = class Introduction {
  title () {
    return 'About us'
  }

  body (h) {
    return [
      'This is the ',
      h('strong', 'about us'),
      ' page.'
    ]
  }
}
