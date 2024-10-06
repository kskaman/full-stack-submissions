import { useState } from 'react'
import PropTypes from 'prop-types'



const RegisterForm = ({ handleRegister, setShowLogin }) => {

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    await handleRegister({
      username: username, name: name,
      email: email, password: password })
    setName('')
    setEmail('')
    setPassword('')
    setUsername('')
  }

  return <>
    <form onSubmit={onSubmit}>
      <div>
        Name
        <input
          type="text"
          value={name}
          name="Name"
          onChange={({ target }) => setName(target.value)}
        />
      </div>
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
        Email
        <input
          type="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
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
      <button type="submit">Register</button>
    </form>
    <button onClick={() => setShowLogin(true)}>Cancel</button>
  </>
}

RegisterForm.propTypes = {
  handleRegister: PropTypes.func.isRequired,
  setShowLogin: PropTypes.func.isRequired
}

export default RegisterForm