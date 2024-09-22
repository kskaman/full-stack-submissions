const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', {name: 'Login'}).click()
}

const createUser = async (request) => {
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
    data : {
      name: 'Test User',
      username: 'testuser',
      password: 'password123'
    }
  })
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create a new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
}

export { loginWith, createUser, createBlog }