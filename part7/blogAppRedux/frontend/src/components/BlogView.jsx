import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { modifyBlog, removeBlog, addComment } from '../reducers/blogReducer'
import { useEffect, useState } from 'react'

import { initializeBlogs } from '../reducers/blogReducer'

const BlogView = () => {
  const [comment, setComment] = useState('')

  const id = useParams().id // Get the user ID from the URL
  const blog = useSelector(state => state.blogs.find(b => b.id === id))
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  // Re-fetch users if user data is not available (e.g., on page refresh)
  useEffect(() => {
    if (!blog) {
      dispatch(initializeBlogs())
    }
  }, [dispatch, blog])

  if (!blog) {
    // Show a loading indicator while fetching user data
    return <div>Loading blog information...</div>
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

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    console.log(comment)

    dispatch(addComment(blog.id, comment))
    setComment('')
  }


  return (
    <div>
      <h2>{blog.title} - {blog.author}</h2>
      <p>{blog.url}</p>
      <p>{blog.likes} likes <button onClick={handleLike}>like</button></p>
      <p>Added by {blog.user && blog.user.username}</p>
      <p>{user && blog.user && user.username === blog.user.username &&
        <button onClick={handleDelete}>delete</button>}</p>
      <h3>comments :</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
      <ul>
        {/* Ensure blog.comments is an array before mapping over it */}
        {blog.comments && blog.comments.length > 0 ? (
          blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))
        ) : (
          <li>No comments yet.</li>
        )}
      </ul>
    </div>
  )
}


export default BlogView