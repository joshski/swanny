const http = require('http')
const App = require('./app')

const port = process.env.PORT || 8887

const app = new App()

const server = http.createServer((req, res) => {
  const response = app.respondTo({ path: req.url })
  res.writeHead(response.statusCode, { 'Content-Type': response.contentType })
  res.end(response.body)
})

const WebSocket = require('ws')
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection (ws, req) {
  console.log("connection")

  ws.on('message', function incoming (message) {
    console.log('received: %s', message)
  });

  const hello = JSON.stringify({
    command: 'hello',
    protocols: ['http://livereload.com/protocols/official-6', 'http://livereload.com/protocols/official-7'],
    serverName: 'beano'
  })

  ws.send(hello)
})

server.listen(port, error => {
  if (error) {
    console.error(error)
    process.exit(666)
  } else {
    console.log('http://localhost:' + port)
  }
})
