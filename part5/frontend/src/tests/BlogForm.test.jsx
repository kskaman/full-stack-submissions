import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

test('calls event handler with correct details when a new blog is created', async () => {
  const mockCreateBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={mockCreateBlog} />)

  // Find the input fields and the submit button
  const titleInput = screen.getByPlaceholderText('Enter blog title')
  const authorInput = screen.getByPlaceholderText('Enter blog author')
  const urlInput = screen.getByPlaceholderText('Enter blog URL')
  const createButton = screen.getByText('Create')

  // Simulate user input
  await user.type(titleInput, 'Testing Blog Forms')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://example.com')

  // Simulate form submission
  await user.click(createButton)

  // Ensure the event handler is called with the correct blog details
  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0].title).toBe('Testing Blog Forms')
  expect(mockCreateBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(mockCreateBlog.mock.calls[0][0].url).toBe('http://example.com')
})
