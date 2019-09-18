const { createServer } = require('..')

createServer(3000, stream => {
  stream.on('data', (data) => {
    console.log(data.toString('utf8'))
  })

  const interval = setInterval(() => {
    if (stream.destroyed) {
      console.log('stream destroyed')
      return clearInterval(interval)
    }
    stream.write('hi')
  }, 1000)
})
