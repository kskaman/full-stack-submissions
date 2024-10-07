import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleAuthorChange = (event) => setAuthor(event.target.value)
  const handleUrlChange = (event) => setUrl(event.target.value)

  const handleAddBlog = async (event) => {
    event.preventDefault()

    if (title === '' || author === '' || url === '') {
      dispatch(setNotificationWithTimeout('Please fill out all fields'), 'fail', 5)
      return
    }

    try {
      dispatch(createBlog({
        title: title,
        author: author,
        url: url
      }))
      dispatch(setNotificationWithTimeout('Blog created successfully!', 'success', 5))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to create Blog, please try again'), 'fail', 5)
    }
  }

  return <>
    <h2>Create new blog</h2>
    <Form onSubmit={handleAddBlog}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          placeholder='Enter blog title'
          value={title}
          onChange={handleTitleChange}
          name="Title"
          data-testid='title'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Author</Form.Label>
        <Form.Control
          placeholder='Enter blog author'
          value={author}
          onChange={handleAuthorChange}
          name="Author"
          data-testid='author'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>URL</Form.Label>
        <Form.Control
          placeholder='Enter blog URL'
          value={url}
          onChange={handleUrlChange}
          name="Url"
          data-testid='url'
        />
      </Form.Group>
      <Button variant="primary" type="submit">Create</Button>
    </Form></>
}

export default BlogForm