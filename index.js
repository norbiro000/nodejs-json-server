const http = require('http')

function handle_income_request (req, res) {
  console.log(`INCOME REQUEST ${req.method} ${req.url}`)
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify({error: null}) + "\n")
}

var server = http.createServer(handle_income_request)
server.listen(2000)