const streamify = require('..')
const stream = streamify('http://localhost:3000')

stream.on('data', chunk => {
  console.log(chunk.toString('utf8'))
})

const interval = setInterval(() => {
  if (stream.destroyed) {
    console.log('stream destroyed')
    return clearInterval(interval)
  }
  stream.write('hola')
}, 1000)
