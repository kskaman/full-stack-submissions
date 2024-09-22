import { useState } from 'react'
import PropTypes from 'prop-types'
import '../styles/Blog.css'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
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
    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }


  return <div className="blog">
    <div className="blogTitleAuthor">
      {blog.title} {blog.author}
      <button onClick={toggleVisibility} data-testid='hide-view-button'>{visible ? 'hide' : 'view'}</button>
    </div>
    {visible && (
      <div className="blogDetails">
        <p className="blogUrl">{blog.url}</p>
        <p className="blogLikes">{blog.likes} likes <button onClick={handleLike} data-testid='like-button'>like</button></p>
        {user.username === blog.user.username &&
          <button onClick={handleDelete} data-testid='delete-button'>Delete</button>}
      </div>)}
  </div>
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog