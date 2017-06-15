const http = require('http')
const WebSocket = require('ws')
const chokidar = require('chokidar')

const App = require('./app')

const port = process.env.PORT || 8887

const app = new App()

const server = http.createServer((req, res) => {
  const response = app.respondTo({ path: req.url })
  res.writeHead(response.statusCode, { 'Content-Type': response.contentType })
  res.end(response.body)
})

const wss = new WebSocket.Server({ server })

chokidar.watch(process.cwd(), {}).on('all', (event, path) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      const url = urls[client.socketId]
      const path = require('url').parse(url).path
      client.send(JSON.stringify({
        command: 'reload',
        url: url,
        path: path
      }))
    }
  })
})

let socketId = 0
const urls = {}
wss.on('connection', function connection (ws, req) {
  ws.socketId = socketId++
  ws.on('message', function incoming (message) {
    const parsed = JSON.parse(message)
    if (parsed.url) {
      urls[ws.socketId] = parsed.url
    }
  })

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
