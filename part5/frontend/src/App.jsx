import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import registerService from './services/register'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)

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

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
    } catch (error) {
      console.error('Login Failed', error)
    }
  }

  const handleRegister = async (credentials) => {
    try {
      await registerService.register(credentials)
    } catch (error) {
      console.error('Registration failed', error)
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
    } catch (error) {
      console.error('Error adding blog', error)
    }
  }
  
  const updateBlog = async (id, updatedBlog) => {
    const returnedBlog = await blogService.update(id, updateBlog)
    setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog)
      .sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = async (id) => {
    await blogService.remo(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  if (user === null) {
    return (
      <div>
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
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
      <Togglable buttonLabel='create a new blog' ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
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