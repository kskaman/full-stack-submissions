const { test, expect, beforeEach, describe } = require('@playwright/test')
const { resetTestEnvironment, userLogin, createNewBlog, likeBlogMultipleTimes } = require('./helper')

describe('Blog Application', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the test environment and go to the homepage before each test
    await resetTestEnvironment(request)
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    // Ensure login form is visible
    await expect(page.getByText('Username')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()
  })

  describe('User Login', () => {
    test('Login succeeds with valid credentials', async ({ page }) => {
      await userLogin(page, 'testuser1', 'password1')

      // Confirm successful login
      await expect(page.getByText('Test User 1 logged in')).toBeVisible()
    })

    test('Login fails with incorrect credentials', async ({ page }) => {
      await userLogin(page, 'testuser1', 'wrongpassword')

      // Ensure login fails and error is displayed
      await expect(page.getByText('Wrong credentials')).toBeVisible()
      await expect(page.getByText('Test User 1 logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await userLogin(page, 'testuser1', 'password1')
    })

    test('A new blog can be created', async ({ page }) => {
      await createNewBlog(page, 'Test Blog', 'Author 1', 'http://example.com')

      // Verify the blog was created
      await expect(page.getByText('Test Blog by Author 1')).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createNewBlog(page, 'Test Blog', 'Author 1', 'http://example.com')
      })

      test('Blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await likeBlogMultipleTimes(page, page.getByRole('button', { name: 'like' }), 1)

        // Verify the blog's likes have increased
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('Blog can be deleted by the creator', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        // Confirm blog deletion
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'Delete' }).click()

        // Verify the blog is no longer visible
        await expect(page.getByText('Test Blog by Author 1')).not.toBeVisible()
      })

      test('Blog cannot be deleted by other users', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await userLogin(page, 'testuser2', 'password2')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
      })
    })

    describe('When multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createNewBlog(page, 'Blog 1', 'Author 1', 'http://example.com/1')
        await createNewBlog(page, 'Blog 2', 'Author 2', 'http://example.com/2')
        await createNewBlog(page, 'Blog 3', 'Author 3', 'http://example.com/3')
      })

      test('Blogs are ordered by likes', async ({ page }) => {
        await page.getByText('Blog 1').getByRole('button', { name: 'view' }).click()
        await page.getByText('Blog 2').getByRole('button', { name: 'view' }).click()
        await page.getByText('Blog 3').getByRole('button', { name: 'view' }).click()

        const blog1Button = page.getByText('Blog 1').getByRole('button', { name: 'like' })
        const blog2Button = page.getByText('Blog 2').getByRole('button', { name: 'like' })
        const blog3Button = page.getByText('Blog 3').getByRole('button', { name: 'like' })

        await likeBlogMultipleTimes(page, blog1Button, 1)
        await likeBlogMultipleTimes(page, blog2Button, 3)
        await likeBlogMultipleTimes(page, blog3Button, 2)

        const blogs = await page.locator('.blog').all()

        // Verify blogs are ordered by the number of likes
        await expect(blogs[0]).toContainText('Blog 2 by Author 2')
        await expect(blogs[1]).toContainText('Blog 3 by Author 3')
        await expect(blogs[2]).toContainText('Blog 1 by Author 1')
      })
    })
  })
})
