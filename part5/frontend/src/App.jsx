import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import registerService from './services/register'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import EventNotification from './components/EventNotification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)
  const [message, setMessage] = useState(null)
  const [flag, setFlag] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {

    const checkTokenExpiration = (token) => {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        // Current time in seconds
        const currentTime = Math.floor(Date.now() / 1000)
        return decodedToken.exp > currentTime
      } catch (error) {
        return false
      }
    }

    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      if (checkTokenExpiration(user.token)) {
        setUser(user)
        blogService.setToken(user.token)
      } else {
        window.localStorage.removeItem('loggedBlogAppUser')
        setUser(null)
        blogService.setToken(null)
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(
        initialBlogs => setBlogs(
          initialBlogs.sort((a, b) => b.likes - a.likes)
        )
      )
    }
  }, [user])


  const notify = (message, type) => {
    setMessage(message)
    setFlag(type)

    setTimeout(() => {
      setMessage(null)
      setFlag(null)
    }, 5000)
  }


  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      notify(`Welcome ${user.username}`, 'success')
    } catch (error) {
      console.error('Login Failed', error)
      notify('Incorrect username or password', 'fail')
    }
  }

  const handleRegister = async (credentials) => {
    try {
      await registerService.register(credentials)
      notify('Registration successful! Please login.', 'success')
    } catch (error) {
      console.error('Registration failed', error)
      notify('Registration failed. Try again.', 'fail')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`Blog '${returnedBlog.title}' added successfully`, 'success')
    } catch (error) {
      console.error('Error adding blog', error)
      notify('Error adding blog. Please try again.', 'fail')
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id === id ? { ...returnedBlog, user: blog.user } : blog)
        .sort((a, b) => b.likes - a.likes))
      notify(`Blog '${returnedBlog.title}' updated successfully`, 'success')
    } catch (error) {
      console.error('Error updating blog', error)
      notify('Error updating blog. Please try again.', 'fail')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      notify('Blog deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting blog', error)
      notify('Error deleting blog. Please try again.', 'fail')
    }
  }


  if (user === null) {
    return (
      <div>
        <EventNotification message={message} flag={flag} />
        {showLogin ?
          <>
            <LoginForm handleLogin={handleLogin} />
            <button onClick={() => setShowLogin(false)}>
              Register
            </button>
          </>
          : <RegisterForm handleRegister={handleRegister} setShowLogin={setShowLogin}/>
        }
      </div>
    )
  }

  return (
    <div>
      <EventNotification message={message} flag={flag} />
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
      <Togglable buttonLabel='create a new blog' ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      <br></br>
      {blogs.map(blog =>
        <Blog
          key={blog.id} blog={blog}
          updateBlog={updateBlog} deleteBlog={deleteBlog}
          user={user}/>
      )}
    </div>
  )
}

export default App