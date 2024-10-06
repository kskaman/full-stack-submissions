import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'


const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser({ username, password }))
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={onLogin}>
        <div>
          Username
          <input
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button
          type="submit"
          data-testid="login-button"
        >Login</button>
      </form>
    </>
  )
}

export default LoginForm