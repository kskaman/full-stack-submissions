import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import EventNotification from './components/EventNotification'
import BlogView from './components/BlogView'
import { Route, Routes } from 'react-router-dom'
import RegisterForm from './components/RegisterForm'
import Navigation from './components/Navigation'
import UsersView from './components/UsersView'
import BlogsView from './components/BlogsView'
import UserView from './components/UserView'
import { Button } from 'react-bootstrap'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  if (user === null) {
    return (
      <div className="container">
        <EventNotification />
        <div className="auth-container" style={{ marginTop: '20px' }}>
          {showLogin ? (
            <>
              <LoginForm />
              <Button className="mt-3" onClick={() => setShowLogin(false)}>
                Register
              </Button>
            </>
          ) : (
            <RegisterForm setShowLogin={setShowLogin} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <>
        <Navigation user={user} handleLogout={handleLogout} />
        <EventNotification />
        <h2>blog app</h2>
        <Routes>
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/users" element={<UsersView />} />
          <Route path="/" element={<BlogsView />} />
        </Routes>
      </>
    </div>
  )
}

export default App