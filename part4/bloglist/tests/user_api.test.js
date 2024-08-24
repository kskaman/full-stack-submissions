const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const BlogUser = require('../models/user')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await BlogUser.deleteMany({})
  const usersWithHashedPasswords = await Promise.all(
    helper.initialUsers.map(async user => {
      const passwordHash = await bcrypt.hash(user.password, 10)
      return new BlogUser({ username: user.username, name: user.name, passwordHash })
    })
  )
  await BlogUser.insertMany(usersWithHashedPasswords)
})

describe('User API tests', () => {
  test('Users are returned as json', async () => {
    await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All users are returned', async () => {
    const response = api.get('/api/users')
    assert.strictEqual((await response).body.length, helper.initialBlogs.length)
  })

  test('user creation succeeds with valid data', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'roOt34^k'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length+1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('root'))
  })

  test('user creation fails with a short username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'superuser',
      password: 'roOt34^k'
    }

    const response = await api.post('/api/users')
      .send(newUser).expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(
      response.body.error,
      'Username and password must be atleast 3 characters long.')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('user creation fails with a short password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'ro'
    }

    const response = await api.post('/api/users')
      .send(newUser).expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(
      response.body.error,
      'Username and password must be atleast 3 characters long.')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})