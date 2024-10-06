import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import EventNotification from './components/EventNotification'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div>
      <EventNotification />
      {user === null ? (
        <LoginForm />
      ) : (
        <>
          <h2>Blogs</h2>
          <p>{user.username} logged in <button onClick={handleLogout}>Logout</button></p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} />
          )}
        </>
      )}
    </div>
  )
}

export default App