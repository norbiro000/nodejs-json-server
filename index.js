const http = require('http')
const fs = require('fs')
const Promise = require('bluebird')

function load_album_list() {
  //Return Promise
  return new Promise((resolve, reject) => {
    // This function will read all file in dir
    fs.readdir(
      // Read file in dir name "album"
      'album',
      // Call Back function when file read is done.
      function(err, files){
        if (err) {
          // if has some error return Promise Reject
          reject(err)
          return
        }
        // If everthing is okay return Promise resolve with all of files name
        resolve(files)
      }
    )
  })
}

function handle_income_request (req, res) {
  console.log(`INCOME REQUEST ${req.method} ${req.url}`)
  res.writeHead(200, {'Content-Type': 'application/json'})
  load_album_list().then(albums => {
    const output = {
      error: null,
      data: {albums: albums}
    }
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(output + "\n"))
  }).catch(error => {
    res.writeHead(503, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(error + "\n"))
    return
  })
}

var server = http.createServer(handle_income_request)
server.listen(2000)