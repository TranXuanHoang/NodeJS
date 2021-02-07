import React, { Fragment } from 'react'

const CommentList = ({ comments }) => {
  const renderedComments = comments.map(comment => {
    let content

    switch (comment.status) {
      case 'approved':
        content = comment.content
        break;
      case 'pending':
        content = (
          <Fragment>
            {comment.content} <span className="alert-warning">Awaiting Moderation</span>
          </Fragment>
        )
        break
      case 'rejected':
        content = (
          <Fragment>
            {comment.content} <span className="alert-danger">Comment Rejected</span>
          </Fragment>
        )
        break
      default:
        break;
    }
    return <li key={comment.id}>{content}</li>
  })

  return <ul>{renderedComments}</ul>
}

export default CommentList
