import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import registerService from './services/register'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState('')
  const [flag, setFlag] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
    }
  }, [user])

  const handleRegister = async (event) => {
    event.preventDefault()
    try {
      const newUser = await registerService.register({
        username: newUsername,
        name: newName,
        password: newPassword,
      })
      setMessage(`User ${newUser.username} successfully registered`)
      setFlag('success')
      setTimeout(() => {
        setMessage(null)
        setFlag('')
      }, 5000)
      setNewUsername('')
      setNewPassword('')
      setNewName('')
    } catch (error) {
      setMessage('Registration failed')
      setFlag('fail')
      setTimeout(() => {
        setMessage(null)
        setFlag('')
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`${user.username} successfully logged in`)
      setFlag('success')
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setTimeout(() => {
        setMessage(null)
        setFlag('')
      }, 5000)
    } catch (error) {
      setMessage('Wrong username or password')
      setFlag('fail')
      setTimeout(() => {
        setMessage(null)
        setFlag('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      }

      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setMessage(`${returnedBlog.title} by ${returnedBlog.author} added`)
      setFlag('success')
      setTimeout(() => {
        setMessage(null)
        setFlag('')
      }, 5000)
    } catch (exception) {
      setMessage('Error adding blog')
      setFlag('fail')
      setTimeout(() => {
        setMessage(null)
        setFlag('')
      }, 5000)
    }
  }

  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )

  const registerForm = () => (
    <form onSubmit={handleRegister}>
      <div>
        Name
        <input
          type="text"
          value={newName}
          name="Name"
          onChange={({ target }) => setNewName(target.value)}
        />
      </div>
      <div>
        Username
        <input
          type="text"
          value={newUsername}
          name="Username"
          onChange={({ target }) => setNewUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={newPassword}
          name="Password"
          onChange={({ target }) => setNewPassword(target.value)}
        />
      </div>
      <button type="submit">Register</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title
        <input
          value={newTitle}
          onChange={handleTitleChange}
          name="Title"
        />
      </div>
      <div>
        Author
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
          name="Author"
        />
      </div>
      <div>
        URL
        <input
          value={newUrl}
          onChange={handleUrlChange}
          name="Url"
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} flag={flag} />
        {showLogin ? loginForm() : registerForm()}
        <button onClick={() => setShowLogin(!showLogin)}>
          {showLogin ? 'Register' : 'Login'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} flag={flag} />
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
      <h2>Create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
