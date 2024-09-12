import { useState } from 'react'
import PropTypes from 'prop-types'

import EventNotification from './EventNotification'

const BlogForm = ({ addBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [flag, setFlag] = useState(null)

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleAuthorChange = (event) => setAuthor(event.target.value)
  const handleUrlChange = (event) => setUrl(event.target.value)

  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      addBlog({
        title: title,
        author: author,
        url: url
      })
      setMessage(`${title} succesfully added`)
      setFlag('success')
    } catch (error) {
      setMessage('Unnable to add blog')
      setFlag('fail')
    } finally {
      setTimeout(() => {
        setMessage(null)
        setFlag(null)
      }, 5000)
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return <>
    <EventNotification message={message} flag={flag} />
    <h2>Create new blog</h2>
    <form onSubmit={handleAddBlog}>
      <div>
        Title
        <input
          placeholder='Enter blog title'
          value={title}
          onChange={handleTitleChange}
          name="Title" />
      </div>
      <div>
        Author
        <input
          placeholder='Enter blog author'
          value={author}
          onChange={handleAuthorChange}
          name="Author" />
      </div>
      <div>
        URL
        <input
          placeholder='Enter blog URL'
          value={url}
          onChange={handleUrlChange}
          name="Url" />
      </div>
      <button type="submit">Create</button>
    </form></>
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm