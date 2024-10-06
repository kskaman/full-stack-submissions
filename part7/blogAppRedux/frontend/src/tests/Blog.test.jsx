import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import Blog from '../components/Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10
  }

  const user = { username: 'testuser' }

  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={() => {}}
      deleteBlog={() => {}}
    />)

  // Check that title and author are rendered
  const titleAuthor = container.querySelector('.blogTitleAuthor')
  expect(titleAuthor).toHaveTextContent('Testing React Components Test Author')

  // check that URL and likes are not rendered by default
  const url = container.querySelector('.blogUrl')
  const likes = container.querySelector('.blogLikes')

  expect(url).toBeNull()
  expect(likes).toBeNull()
})


test('renders url and likes when the "view" button is clicked', async () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'testuser'
    }
  }

  const user = {
    username: 'testuser'
  }

  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={() => {}}
      deleteBlog={() => {}}
    />)

  // Initially, URL and likes should not be visible
  let url = container.querySelector('.blogUrl')
  let likes = container.querySelector('.blogLikes')

  expect(url).toBeNull()
  expect(likes).toBeNull()

  // Click the "view" button
  const button = screen.getByText('view')
  const userEventInstance = userEvent.setup()
  await userEventInstance.click(button)

  // After clicking, URL and likes should be visible
  url = container.querySelector('.blogUrl')
  likes = container.querySelector('.blogLikes')

  expect(url).toHaveTextContent('http://example.com')
  expect(likes).toHaveTextContent('10 likes')
})


test('calls the event handler twice when the like button is clicked twice', async () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'testuser'
    }
  }

  const user = {
    username: 'testuser'
  }

  const mockUpdateBlog = vi.fn()

  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={mockUpdateBlog}
      deleteBlog={() => {}} />
  )

  // Click the "view" button to show the details including the like button
  const viewButton = screen.getByText('view')
  const userEventInstance = userEvent.setup()
  await userEventInstance.click(viewButton)

  // Click the like button twice
  const likeButton = screen.getByText('like')
  await userEventInstance.click(likeButton)
  await userEventInstance.click(likeButton)

  // Ensure the like handler is called twice
  expect(mockUpdateBlog.mock.calls).toHaveLength(2)
})
