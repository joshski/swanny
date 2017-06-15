module.exports = Page => class Index extends Page {
  title () {
    return 'Introduction'
  }

  bodyContents () {
    return 'this is the introduction'
  }
}
