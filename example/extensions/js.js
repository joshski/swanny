module.exports = path => {
  return {
    layout: 'default',
    content: require(path)
  }
}
