const { Transform } = require('readable-stream')
const duplexify = require('duplexify')
const io = require('socket.io-client')
const { Buffer } = require('safe-buffer')

function buildProxy (options, socketWrite, socketEnd) {
  const proxy = new Transform({
    objectMode: options.objectMode
  })

  proxy._write = socketWrite
  proxy._flush = socketEnd

  return proxy
}

function createStream (target, options = {}) {
  let stream, socket

  if (options.objectMode === undefined) {
    options.objectMode = !(options.binary === true || options.binary === undefined)
  }

  // browser only: sets the maximum socket buffer size before throttling
  const bufferSize = options.browserBufferSize || 1024 * 512

  // browser only: how long to wait when throttling
  const bufferTimeout = options.browserBufferTimeout || 1000

  const coerceToBuffer = !options.objectMode

  // use existing SocketIO object that was passed in
  if (typeof target === 'object') {
    socket = target
  } else {
    socket = io(target, options.socketIO)
  }

  socket.binary(true)

  const isBrowser = process.title === 'browser'
  const socketWrite = isBrowser ? socketWriteBrowser : socketWriteNode
  const proxy = buildProxy(options, socketWrite, socketEnd)

  if (!options.objectMode) {
    proxy._writev = writev
  }

  // was already open when passed in
  if (socket.connected) {
    stream = proxy
  } else {
    stream = duplexify(undefined, undefined, options)
    if (!options.objectMode) {
      stream._writev = writev
    }
    socket.once('connect', onopen)
  }

  stream.socket = socket
  socket.on('disconnect', onclose)
  socket.on('error', onerror)
  socket.on('message', onmessage)

  proxy.on('close', destroy)

  function socketWriteNode (chunk, _, next) {
    if (!socket.connected) {
      next()
      return
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, 'utf8')
    }

    socket.send(chunk, next)
  }

  function socketWriteBrowser (chunk, enc, next) {
    if (bufferedAmount(socket) > bufferSize) {
      setTimeout(socketWriteBrowser, bufferTimeout, chunk, enc, next)
      return
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, 'utf8')
    }

    try {
      socket.send(chunk, next)
    } catch (err) {
      next(err)
    }
  }

  function socketEnd (done) {
    destroy()
    done()
  }

  function onopen () {
    stream.setReadable(proxy)
    stream.setWritable(proxy)
    stream.emit('connect')
  }

  function onclose () {
    stream.end()
    stream.destroy()
  }

  function onerror (err) {
    stream.destroy(err)
  }

  function onmessage (msg, ack) {
    let data = msg
    if (data instanceof ArrayBuffer) {
      data = Buffer.from(data)
    } else if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data, 'utf8')
    }
    proxy.push(data)
    ack()
  }

  function destroy () {
    socket.close ? socket.close() : socket.disconnect()
  }

  // this is to be enabled only if objectMode is false
  function writev (chunks, cb) {
    const buffers = new Array(chunks.length)
    for (let i = 0; i < chunks.length; i++) {
      if (typeof chunks[i].chunk === 'string') {
        buffers[i] = Buffer.from(chunks[i], 'utf8')
      } else {
        buffers[i] = chunks[i].chunk
      }
    }

    this._write(Buffer.concat(buffers), 'binary', cb)
  }

  function bufferedAmount (socket) {
    let len = 0
    socket.sendBuffer.forEach(chunk => {
      len = len + chunk.length
    })
    socket.io.packetBuffer.forEach(chunk => {
      len = len + chunk.length
    })
    return len
  }

  return stream
}

module.exports = createStream
