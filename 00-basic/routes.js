const fs = require('fs')

const requestHandler = (req, res) => {
  console.log(req.method, req.url)
  const url = req.url
  const method = req.method

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>Enter Message</title></head>')
    res.write('<body>')
    res.write('<h1>Enter your message</h1>')
    res.write('<form method="POST" action="/message">')
    res.write('<input type="text" name="message" row="4">')
    res.write('<button type="submit">Send</button>')
    res.write('</form>')
    res.write('</body>')
    res.write('</html>')
    return res.end()
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log(chunk)
      body.push(chunk)
    })
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()
      const message = parsedBody.split('=')[1]
      fs.writeFile('message.txt', message, (err) => {
        console.error(err)
        if (!err) {
          res.statusCode = 302
          res.setHeader('Location', '/')
          return res.end()
        }
      })
    })
  }

  res.setHeader('Content-Type', 'text/html')
  res.write('<html>')
  res.write('<head><title>My Website</title></head>')
  res.write('<body>')
  res.write('<h1>Hello World</h1>')
  res.write('</body>')
  res.write('</html>')
  res.end()
}

module.exports = requestHandler
