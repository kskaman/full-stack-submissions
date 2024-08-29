const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const BlogUser = require('../models/user')
const helper = require('../tests/test_helper')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

beforeEach( async () => {
  await Blog.deleteMany({})
  await BlogUser.deleteMany({})

  const userWithHashPassword = await Promise.all(
    helper.initialUsers.map(async user => {
      const passwordHash = await bcrypt.hash(user.password, 10)
      return new BlogUser({
        username: user.username,
        name: user.name,
        passwordHash,
      })
    })
  )

  const savedUsers = await BlogUser.insertMany(userWithHashPassword)

  const blogsWithUsers = helper.initialBlogs.map((blog, index) => {
    return new Blog({
      ...blog,
      user: savedUsers[index % savedUsers.length]._id // Distribute blogs among users
    })
  })

  await Blog.insertMany(blogsWithUsers)

  // Update users with their respective blogs
  for (let i = 0; i < savedUsers.length; i++) {
    savedUsers[i].blogs = blogsWithUsers
      .filter(blog => blog.user.toString() === savedUsers[i]._id.toString())
      .map(blog => blog._id)

    await savedUsers[i].save()
  }
})

describe('Blog API tests', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid blog can be added by an authenticated user', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const token = helper.generateTokenForUser(user)
    console.log('token generated in test file: ', token)

    const newBlog = {
      title: 'New Blog Post',
      url: 'http://example.com',
      author: 'Author Name',
      likes: 3
    }

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(newBlog.title))

    // Check if the blog is associated with the correct user
    const userAtEnd = await BlogUser.findById(user.id)
      .populate('blogs', { title: 1, url: 1, likes: 1 })

    assert.strictEqual(userAtEnd.blogs.length, user.blogs.length + 1)
    assert(userAtEnd.blogs.some(blog => blog.title === newBlog.title))
  })

  test('blog creation fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      url: 'http://example.com',
      author: 'Author',
      likes: 2,
    }

    const response = await api.post('/api/blogs')
      .send(newBlog).expect(401)

    assert.strictEqual(response.body.error, 'token invalid or missing')

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog can be deleted by the user who created it', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]
    const token = helper.generateTokenForUser(user)

    const blogsAtStart = await helper.blogsInDb()

    const blogToDelete = blogsAtStart.find(blog =>
      blog.user.toString() === user.id.toString())

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    // check blog count has decreased
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    // Verify that the blog is no longer in the database
    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))

    // Check if the blog is removed from the user's blogs
    const userAtEnd = await BlogUser.findById(user.id).populate('blogs')
    assert.strictEqual(userAtEnd.blogs.length, user.blogs.length - 1)
  })

  test('a blog cannot be deleted by a user who did not create it', async() => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(blog =>
      blog.user.toString() === user.id.toString()
    )

    const otherUser = new BlogUser({
      username: 'anotheruser',
      name: 'Another user',
      passwordHash: await bcrypt.hash('password', 10)
    })
    await otherUser.save()

    const token = helper.generateTokenForUser(otherUser)

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    // Ensure the blog count remains the same
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

    // Verify that the blog is still in the database
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(blogToDelete.title))
  })
})

after( async () => {
  await Blog.deleteMany({})
  await BlogUser.deleteMany({})
  await mongoose.connection.close()
})