const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())

app.post('/events', async (req, res) => {
  const { type, data } = req.body

  if (type === 'CommentCreated') {
    const { id, content, postId } = data
    const status = content.includes('orange') ? 'rejected' : 'approved'

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id,
        postId,
        content,
        status
      }
    })
  }

  res.send({})
})

app.listen(4003, () => {
  console.log('[Moderation Microservice] Listening on port 4003')
})
