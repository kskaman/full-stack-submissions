import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState('')
  const [flag, setFlag] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  const addBlog = async (event) => {
    event.preventDefault()
    const BlogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    const returnedBlog = await blogService.create(BlogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNewBlog('')
    setMessage(`${returnedBlog.title} by ${returnedBlog.author} added`)
    setFlag('success')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`${username} succesfully logged in`)
      setFlag('success')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage('wrong username or password')
      setFlag('fail')
      setTimeout(() => {
        setMessage('')
        setFlag('')
      }, 5000)
    }
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }


  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogout = () => {
    wondow.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const loginForm = () => {
    return <form onSubmit={handleLogin}>
      <div>
        username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type="submit">login</button>
    </form>
  }
  
  const blogForm = () => {
    return <form onSubmit={addBlog}>
      <div>
        Title
        <input
          value={newTitle}
          onChange={(handleTitleChange)}
          name="Title"
          onChangeCapture={({ title }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        Author
        <input
          value={newAuthor}
          onChange={(handleAuthorChange)}
          name="Author"
          onChangeCapture={({ title }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        url
        <input
          value={newUrl}
          onChange={(handleUrlChange)}
          name="url"
          onChangeCapture={({ title }) => setNewTitle(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} flag={flag} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} flag={flag} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App