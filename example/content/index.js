module.exports = Page => class Index extends Page {
  title () {
    return 'Home Page'
  }

  bodyContents () {
    return 'this is the home page'
  }
}
