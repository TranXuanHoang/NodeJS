import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([])

  const fetchData = useCallback(async () => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`)

    setComments(res.data)
  }, [postId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const renderedComments = comments.map(comment => {
    return <li key={comment.id}>{comment.content}</li>
  })

  return <ul>{renderedComments}</ul>
}

export default CommentList
