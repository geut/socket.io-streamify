const http = require('http')
const getPort = require('get-port')
const waitForExpect = require('wait-for-expect')

const streamify = require('..')

beforeAll(async () => {
  this.port = await getPort()
  this.url = `http://localhost:${this.port}`
  const httpServer = http.createServer()
  this.server = streamify.createServer(httpServer)
  return new Promise(resolve => httpServer.listen(this.port, resolve))
})

afterAll(() => {
  return new Promise(resolve => this.server.close(resolve))
})

const send = (stream, msg) => !stream.destroyed && stream.write(msg)

test('ping / pong', async () => {
  const clientStream = streamify(this.url)
  const messages = []
  let end = false

  this.server.onStream(stream => {
    stream.on('data', chunk => {
      messages.push(chunk.toString('utf8'))
      send(stream, 'pong')
    })
  })

  clientStream.on('data', chunk => {
    messages.push(chunk.toString('utf8'))
    if (end) return
    send(clientStream, 'ping')
    end = true
  })

  send(clientStream, 'ping')

  await waitForExpect(() => {
    expect(messages).toEqual(['ping', 'pong', 'ping', 'pong'])
  })
})
