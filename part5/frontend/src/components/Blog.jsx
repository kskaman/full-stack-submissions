import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hide = { display: visible ? 'none' : '' }
  const show = { display: visible ? '' : 'none' }
  
  const toggleVisibility = () => {
    setVisible(true)
  }

  const handleLike = () => {
    updateBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, updateBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }



  return <div className="blog">
    <div>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
    </div>
    {visible && (
      <div>
        <p>{blog.url}</p>
        <p>{blog.likes} likes <button onClick={handleLike}>like</button></p>
        {user.username === blog.user.username && <button onClick={handleDelete}>Delete</button>}
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