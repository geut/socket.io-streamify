# socket.io-streamify

[![Build Status](https://travis-ci.com/geut/socket.io-streamify.svg?branch=master)](https://travis-ci.com/geut/socket.io-streamify)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Convert your socket.io sockets into duplex streams.

This module is based on the work of [websocket-stream](https://github.com/maxogden/websocket-stream) we modified the code to support socket.io

## <a name="install"></a> Install

```
$ npm install @geut/socket.io-streamify
```

## <a name="usage"></a> Usage

### Client
```javascript
const streamify = require('@geut/socket.io-streamify')
const stream = streamify('http://localhost:3000')

stream.on('data', chunk => {
  console.log(chunk.toString('utf8'))
})

stream.write('hello from client')
```

### Server
```javascript
const { createServer } = require('@geut/socket.io-streamify')

createServer(3000, stream => {
  stream.on('data', (data) => {
    console.log(data.toString('utf8'))
    stream.write('hi from server')
  })
})
```

## <a name="api"></a> API

#### `const stream = streamify(url|socket, [options])`

#### Options

The available options differs depending on if you use this module in the browser or with node.js.

##### `options.browserBufferSize`

How much to allow the [socket.bufferedAmount](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Attributes) to grow before starting to throttle writes. This option has no effect in node.js.

Default: `1024 * 512` (512KiB)

##### `options.browserBufferTimeout`

How long to wait before checking if the socket buffer has drained sufficently for another write. This option has no effect in node.js.

Default: `1000` (1 second)

##### `options.objectMode`

Send each chunk on its own, and do not try to pack them in a single
websocket frame.

Default: `false`

##### `options.binary`

Always convert to `Buffer` in Node.js before sending.
Forces `options.objectMode` to `false`.

Default: `true`

##### `options.socketIO`

Options for the socketIO instance.

#### `const io = streamify.createServer(port|server, [options], [callback])`

#### Options

Options are part of Socket.IO server.

#### Callback

`function (stream) {}`

Execute it every time the server gets a new socket connection.

#### `io.onStream(stream => {})`

Add a listener for a `stream` event.

#### `io.removeOnStream(stream => {})`

Remove a listener for a `stream` event.

## <a name="issues"></a> Issues

:bug: If you found an issue we encourage you to report it on [github](https://github.com/geut/socket.io-streamify/issues). Please specify your OS and the actions to reproduce it.

## <a name="contribute"></a> Contributing

:busts_in_silhouette: Ideas and contributions to the project are welcome. You must follow this [guideline](https://github.com/geut/socket.io-streamify/blob/master/CONTRIBUTING.md).

## License

MIT © A [**GEUT**](http://geutstudio.com/) project
