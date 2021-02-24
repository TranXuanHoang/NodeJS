import React, { useState } from 'react'
import axios from 'axios'

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()

    await axios.post(`https://blog.com/posts/${postId}/comments`, {
      content
    })

    setContent('')
  }

  return <div>
    <form onSubmit={onSubmit}>
      <div className="form=group">
        <label>New Comment</label>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          className="form-control" />
        <button className="btn btn-primary">Submit</button>
      </div>
    </form>
  </div>
}

export default CommentCreate
