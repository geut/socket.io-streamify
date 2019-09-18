const SocketIOServer = require('socket.io')
const createStream = require('./stream')

class Server extends SocketIOServer {
  constructor (port, options) {
    super(port, options)

    if (port instanceof Object && !port.listen && !options) {
      options = port
    }

    this._listeners = new Set()

    this.on('connect', (socket) => {
      const stream = createStream(socket, options)
      this._listeners.forEach(cb => cb(stream))
    })
  }

  onStream (cb) {
    this._listeners.add(cb)
  }

  removeOnStream (cb) {
    this._listeners.remove(cb)
  }
}

module.exports.Server = Server
module.exports.createServer = function (port, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = undefined
  }

  const server = new Server(port, options)

  if (cb) server.onStream(cb)

  return server
}
