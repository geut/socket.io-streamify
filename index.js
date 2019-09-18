const createStream = require('./lib/stream')
const { Server, createServer } = require('./lib/server')

module.exports = createStream
module.exports.Server = Server
module.exports.createServer = createServer
