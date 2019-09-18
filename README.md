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

## <a name="issues"></a> Issues

:bug: If you found an issue we encourage you to report it on [github](https://github.com/geut/socket.io-streamify/issues). Please specify your OS and the actions to reproduce it.

## <a name="contribute"></a> Contributing

:busts_in_silhouette: Ideas and contributions to the project are welcome. You must follow this [guideline](https://github.com/geut/socket.io-streamify/blob/master/CONTRIBUTING.md).

## License

MIT © A [**GEUT**](http://geutstudio.com/) project
