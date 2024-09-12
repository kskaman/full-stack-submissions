import { useState } from 'react'
import PropTypes from 'prop-types'
import EventNotification from './EventNotification'


const LoginForm = ({ handleLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [flag, setFlag] = useState(null)

  const onLogin = async (event) => {
    event.preventDefault()

    try {
      await handleLogin({ username, password })
      setMessage(`Welcome ${username}`)
      setFlag('success')
    } catch (error) {
      setMessage('Incorrect username or password')
      setFlag('fail')
    } finally {
      setTimeout(() => {
        setMessage(null)
        setFlag(null)
      }, 5000)
    }

    setUsername('')
    setPassword('')
  }

  return <>
    <EventNotification message={message} flag={flag} />
    <h2>Log in to application</h2>
    <form onSubmit={onLogin}>
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
  </>
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm