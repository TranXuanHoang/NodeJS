const fs = require('fs')

// Define routes of the app
const ROUTES = {
  HOME: '/',
  USERS: '/users',
  CREATE_USER: '/create-user'
}

// Get CSS
let css
fs.readFile('./style.css', (err, data) => {
  css = data.toString()
})

const requestHandler = (req, res) => {
  const url = req.url
  const method = req.method
  console.log(method, url)

  if (url === ROUTES.HOME) {
    res.setHeader('Content-Type', 'text/html')
    res.write(
      `<html>
      <head>
        <title>User Portal</title>
        <style>${css}</style>
      </head>`
    )
    res.write(
      `<body>
        <header>
          <nav>
            <a href="${ROUTES.HOME}" class="active">Home</a>
            <a href="${ROUTES.USERS}">Users</a>
          </nav>
          <br>
        </header>
        <h1>Enter your username</h1>
        <form method="POST" action="${ROUTES.CREATE_USER}">
          <p>
            <input type="text" name="username" autocomplete="off">
          </p>
          <button type="submit">Add User</button>
        </form>
      </body>
      </html>`
    )
    return res.end()
  }

  if (url === ROUTES.CREATE_USER && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk)
    })
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()
      const username = parsedBody.split('=')[1]

      // Load current users list from file
      fs.readFile('users.json', (err, data) => {
        // If cannot load users data from file, consider that as the first time
        // create user request was sent by assigning the 'users' list as an empty array
        users = !err ? JSON.parse(data.toString()) : []
        users.push(username)

        // Save users list with new user added to file
        fs.writeFile('users.json', JSON.stringify(users, '', 2), (err) => {
          console.error(err)
          if (!err) {
            res.statusCode = 302
            res.setHeader('Location', ROUTES.USERS)
            return res.end()
          }
        })
      })
    })
  }

  if (url === ROUTES.USERS) {
    // Read users data from file and return a webpage showing the users list
    fs.readFile('users.json', (err, data) => {
      users = !err ? JSON.parse(data.toString()) : []
      let usersList = users.map(username => `<li>${username}</li>`).join('')

      res.setHeader('Content-Type', 'text/html')
      res.write(
        `<html>
        <head>
          <title>Users</title>
          <style>${css}</style>
        </head>`
      )
      res.write(
        `<body>
          <header>
            <nav>
              <a href="${ROUTES.HOME}">Home</a>
              <a href="${ROUTES.USERS}" class="active">Users</a>
            </nav>
            <br>
          </header>
          <h1>List of Users</h1>
          ${users.length > 0 ? `<ol>${usersList}</ol>` : 'No users found!'}
        </body>
        </html>`
      )
      return res.end()
    })
  }
}

module.exports = requestHandler
