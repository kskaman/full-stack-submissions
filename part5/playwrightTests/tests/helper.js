const resetTestEnvironment = async (request) => {
  // Clear the database and create test users
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
    data: {
      name: 'Test User 1',
      username: 'testuser1',
      password: 'password1'
    }
  })
  await request.post('/api/users', {
    data: {
      name: 'Test User 2',
      username: 'testuser2',
      password: 'password2'
    }
  })
}
  
const userLogin = async (page, username, password) => {
  // Log in as a user with provided credentials
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}
  
const createNewBlog = async (page, title, author, url) => {
  // Create a new blog post with the given details
  await page.getByRole('button', { name: 'create a new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()

  // Wait for blog creation confirmation
  await page.getByText(`${title} by ${author}`).waitFor()
}
  
const likeBlogMultipleTimes = async (page, likeButton, count) => {
  // Like a blog multiple times
  for (let i = 0; i < count; i++) {
    await likeButton.click()
    await page.getByText(`likes ${i + 1}`).waitFor()
  }
}
  
export { resetTestEnvironment, userLogin, createNewBlog, likeBlogMultipleTimes }
  