const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createUser, createBlog } = require('./helper')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await createUser(request)
    await page.goto('http://localhost:5173')
  })

  // 5.17: Test login form is shown
  test('Login form is visible', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByTestId('login-button')).toBeVisible()
  })

  // 5.18: Test login functionality
  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'testuser', 'password123')
  
    const welcomeMessage = await page.getByTestId('errorMessage')
    await expect(welcomeMessage).toHaveText('Welcome testuser')
    await expect(welcomeMessage).toBeVisible()
    await expect(page.getByRole('button', { name: 'Logout'})).toBeVisible()
  })
  
  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'testuser', 'wrongpassword')
  
    const errorMessage = await page.getByTestId('errorMessage')
    await expect(errorMessage).toContainText('Incorrect username or password')
    await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0')
    await expect(errorMessage).toBeVisible()
  })
  
  // 5.19: Test blog creation
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'New Blog', 'Author Name', 'http://example.com')
      const newBlog = await page.getByText('New Blog Author Name')
      await expect(newBlog).toBeVisible()
    })
    
    // 5.20: Test blog liking
    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable Blog', 'Author', 'http://example.com')
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      const likes = await page.getByText('1 likes')
      await expect(likes).toBeVisible()
    })

    // 5.21: Test blog deletion
    test('Delete a blog', async ({ page }) => {
      await createBlog(page, 'Blog to Delete', 'Author', 'http://example3.com')

      const blog = page.locator('.blog').filter({ hasText: 'Blog to Delete' })
      await blog.getByRole('button', { name: 'view' }).click()

      
      await page.getByRole('button', { name: 'like' }).toBeVisible()
      // Ensure the delete button is visible only to the creator
      await page.getByRole('button', { name: 'Delete' }).toBeVisible()

      // Handle the confirmation dialog
      page.on('dialog', async (dialog) => {
        await dialog.accept()
      });

      // Check that the blog is deleted
      await expect(blog).not.toBeVisible()
    })


    // 5.22: Test delete button visibility
    test('delete button is only shown to the creator', async ({ page }) => {
      await createBlog(page, 'Blog with Delete Button', 'Author', 'http://example.com')
      await page.getByRole('button', { name: 'view' }).click()
      const deleteButton = await page.getByTestId('delete-button')
      await expect(deleteButton).toBeVisible()
    })
    

    test('Blogs should be ordered by likes', async ({ page }) => {
      await createBlog(page, 'Blog 1', 'Author 1', 'http://example1.com')
      await createBlog(page, 'Blog 2', 'Author 2', 'http://example2.com')
      await createBlog(page, 'Blog 3', 'Author 3', 'http://example3.com')

      const blog1 = page.locator('.blog').filter({ hasText: 'Blog 1' })
      const blog2 = page.locator('.blog').filter({ hasText: 'Blog 2' })
      const blog3 = page.locator('.blog').filter({ hasText: 'Blog 3' })

      // Like the blogs
      await blog3.getByRole('button', { name: 'view' }).click()
      await blog3.getByTestId('like-button').click()
      await blog3.getByTestId('like-button').click()

      await blog2.getByRole('button', { name: 'view' }).click()
      await blog2.getByTestId('like-button').click()

      // Verify the ordering of blogs by likes
      const firstBlog = page.locator('.blog').first()
      const secondBlog = page.locator('.blog').nth(1)
      const lastBlog = page.locator('.blog').last()

      await expect(firstBlog).toContainText('Blog 3')
      await expect(secondBlog).toContainText('Blog 2')
      await expect(lastBlog).toContainText('Blog 1')
    })
  })
})