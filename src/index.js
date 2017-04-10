const github = require('./github')

module.exports = () => name => github.search(name)
