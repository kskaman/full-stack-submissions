const { test, after, beforeEach, } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is one blog', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body[0]._id, undefined)
})


test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Author',
    url: 'http://newblog.com',
    likes: 5
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(blogsAtEnd.some(blog => blog.title === 'New Blog'))
})


test('likes property defaults to 0 if missing', async() => {
  const newBlog = {
    title: 'Another Blog Post',
    author: 'Author Author',
    url: 'http://anotherexample.com'
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd.find(blog => blog.title === 'Another Blog Post')
  assert.strictEqual(addedBlog.likes, 0)
})


test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Author',
    url: 'http://newBlog.com',
    likes: 5
  }

  const response = await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)

  assert.strictEqual(response.body.error, 'Title and URL are required')
})



test('blog without url is not added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Author',
    likes: 5
  }

  const response = await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)

  assert.strictEqual(response.body.error, 'Title and URL are required')
})


test('updates the number of likes for a blog', async () => {
  const blogsPresent = await helper.blogsInDb()
  const blogToUpdate = blogsPresent[0]
  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1
  }

  await api.put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const updateBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
  assert.strictEqual(updateBlog.likes, blogToUpdate.likes + 1)
})


test('a note can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})


after(async () => {
  await mongoose.connection.close()
})