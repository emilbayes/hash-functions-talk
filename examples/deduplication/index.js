var http = require('http')
var path = require('path')
// CAS is a common acronym for Content Addressable Storage
var cas = require('content-addressable-blob-store')

// Initialise our CAS at in the directory `uploads` next to our server
// Other abstract-blob-stores exist that support backends such as S3 and Azure
var uploads = cas(path.join(__dirname, '/uploads'))


var server = http.createServer(function (req, res) {
  if (req.method === 'POST') return upload()
  if (req.method === 'GET') return download()
  return send(400)

  // Convenience method used throughout the server
  function send(code, content) {
    res.writeHead(code)
    res.end(content)
  }

  // Take the request body and pipe it into CAS. This will place the upload in a
  // unique temporary file as it is being uploaded, and atomically move it once
  // we have seen all bytes and know it's hash value
  function upload () {
    req.pipe(uploads.createWriteStream(oninfo))
    return

    // Called when the writing has been completed and the hash value calculated
    function oninfo (err, info) {
      if (err) return send(500)

      // Respond with a formatted JSON string that is easy for humans and
      // computers to read
      return send(201, JSON.stringify(info, null, 2) + '\n')
    }
  }

  // Take the file under url /{hash}, check if we know it and if so, pipe it
  // into the response stream
  function download () {
    // Sicne we assume /{hash}, we can slice off the first char (`/`), and get
    // the hash
    var hash = req.url.slice(1)
    uploads.exists({key: hash}, onexists)

    return

    function onexists (err, found) {
      if (err) return send(500)
      if (!found) return send(404)

      res.writeHead(200)
      uploads.createReadStream({key: hash})
        // if there's an error, we're going to ignore it for now, and close the
        // reponse stream. This might not be the best way to handle errors, but
        // it makes this example simpler
        .on('error', _ => res.end())
        .pipe(res)
    }
  }
})

server.listen(2017, function () {
  console.log('http://localhost:2017')
})
