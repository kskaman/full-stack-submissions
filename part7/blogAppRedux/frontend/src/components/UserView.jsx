import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { initializeUsers } from '../reducers/usersReducer'

const UserView = () => {
  const { id } = useParams() // Get the user ID from the URL
  const user = useSelector(state => state.users.find(u => u.id === id))
  const dispatch = useDispatch()

  // Re-fetch users if user data is not available (e.g., on page refresh)
  useEffect(() => {
    if (!user) {
      dispatch(initializeUsers())
    }
  }, [dispatch, user])

  if (!user) {
    // Show a loading indicator while fetching user data
    return <div>Loading user information...</div>
  }
  return (
    <div>
      <h2>{user.username}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView