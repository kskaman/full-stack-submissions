import { useState } from 'react'
import PropTypes from 'prop-types'


const BlogForm = ({ addBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleAuthorChange = (event) => setAuthor(event.target.value)
  const handleUrlChange = (event) => setUrl(event.target.value)

  const handleAddBlog = async (event) => {
    event.preventDefault()

    addBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return <>
    <h2>Create new blog</h2>
    <form onSubmit={handleAddBlog}>
      <div>
        Title
        <input
          placeholder='Enter blog title'
          value={title}
          onChange={handleTitleChange}
          name="Title"
          data-testid='title'
        />
      </div>
      <div>
        Author
        <input
          placeholder='Enter blog author'
          value={author}
          onChange={handleAuthorChange}
          name="Author"
          data-testid='author'
        />
      </div>
      <div>
        URL
        <input
          placeholder='Enter blog URL'
          value={url}
          onChange={handleUrlChange}
          name="Url"
          data-testid='url'
        />
      </div>
      <button type="submit">Create</button>
    </form></>
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm