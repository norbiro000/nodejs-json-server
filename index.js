// Author: Norbiro000
const http = require('http')
const fs = require('fs')
const Promise = require('bluebird')

function load_album_list() {
  // 1. Return Promise
  return new Promise((resolve, reject) => {
    // This function will read all file in dir
    fs.readdir(
      // 2. Read file in dir name "album"
      'album',
      // Call Back function when file read is done.
      function(err, files){
        if (err) {
          // 3. if has some error return Promise Reject
          reject(err)
          return
        }
        // 3. files => list of all of files
        // Now we have some file but not khow whice is real directory
        const only_dir = [];
        // 4. Use Iterator for Async Loop 
        (function iterator (index){
          if (index == files.length) {
            // 5. if End of loop will return Dir name list to next step
            resolve(only_dir)
            return
          } else {
            // 5. if in process we'll check this file is diractory
            // via fs.stat and isDirectory()
            fs.stat(
              "album/" + files[index],
              function(err, stats){
                if (err) {
                  // 6. Has some Error force end of loop
                  reject(err)
                  return
                }

                if (stats.isDirectory()) {
                  // 6. Append dir name into Array
                  only_dir.push(files[index])
                }
                // 7. recursive with next index
                iterator(index + 1)
            })
          }
        })(0) // 0. start the Iterator function with index 0
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
    res.end(JSON.stringify(output) + "\n")
  }).catch(error => {
    res.writeHead(503, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(error) + "\n")
    return
  })
}

var server = http.createServer(handle_income_request)
server.listen(2000)