import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '../reducers/usersReducer'
import { Link } from 'react-router-dom'

const UsersView = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)  // Fetching from the usersReducer
  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  if (!users || users.length === 0) {
    // Display a loading message or a fallback message when users are not available
    return <div>Loading users...</div>
  }


  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView