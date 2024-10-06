import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotificationWithTimeout } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(
        blog => blog.id === updatedBlog.id ? updatedBlog : blog
      )
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    }
  }
})

export const { setBlogs, addBlog, updateBlog, deleteBlog } = blogSlice.actions


// Thunk action for fetching all blogs
export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

// Thunk action for adding a blog
export const createBlog = (newBlog) => {
  return async dispatch => {
    try {
      const createdBlog = await blogService.create(newBlog)
      dispatch(addBlog(createdBlog))
      dispatch(setNotificationWithTimeout(`Added blog: ${createdBlog.title}`, 'success', 5))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to add blog', 'fail', 5))
    }
  }
}

// Thunk action for updating a blog
export const modifyBlog = (id, blog) => {
  return async (dispatch, getState) => {
    try {
      // Get the original blog to preserve the user object
      const currentBlog = getState().blogs.find(b => b.id === id)

      // Update the blog with the backend
      const updatedBlog = await blogService.update(id, blog)

      // Preserve the full user object from the original blog
      dispatch(updateBlog({
        ...updatedBlog,
        user: currentBlog.user // Ensure the full user object remains
      }))

      dispatch(setNotificationWithTimeout(`Updated blog: ${updatedBlog.title}`, 'success', 5))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to update blog', 'fail', 5))
    }
  }
}


// Thunk action for deleting a blog
export const removeBlog = (id) => {
  return async dispatch => {
    try {
      await blogService.remove(id)
      dispatch(deleteBlog(id))
      dispatch(setNotificationWithTimeout('Blog deleted successfully', 'success', 5))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to delete blog', 'fail', 5))
    }
  }
}

export default blogSlice.reducer