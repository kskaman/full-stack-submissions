import { useDispatch } from 'react-redux'
import { modifyBlog, removeBlog } from '../reducers/blogReducer'
import { useState } from 'react'

import PropTypes from 'prop-types'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user
    }
    dispatch(modifyBlog(blog.id, updatedBlog))
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id))
    }
  }


  return (
    <div className="blog">
      <div className="blogTitleAuthor">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blogDetails">
          <p>{blog.url}</p>
          <p>{blog.likes} likes <button onClick={handleLike}>like</button></p>
          {user && blog.user && user.username === blog.user.username &&
            <button onClick={handleDelete}>Delete</button>}
        </div>
      )}
    </div>
  )
}


Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog