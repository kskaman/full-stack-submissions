import { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { registerUser } from '../reducers/userReducer'

const RegisterForm = ({ setShowLogin }) => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    dispatch(registerUser({
      username: username,
      name: name,
      email: email,
      password: password
    }))

    // Reset form fields
    setName('')
    setEmail('')
    setPassword('')
    setUsername('')
  }

  return (
    <>
      <h2>Fill in the details to Register</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            name="Name"
            onChange={({ target }) => setName(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">Register</Button>
      </Form>

      <Button variant="secondary" className="mt-2" onClick={() => setShowLogin(true)}>
        Cancel
      </Button>
    </>
  )
}

RegisterForm.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
}

export default RegisterForm
