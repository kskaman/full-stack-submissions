const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const BlogUser = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

beforeEach(async () => {
  await BlogUser.deleteMany({})

  const usersWithHashedPasswords = await Promise.all(
    helper.initialUsers.map(async user => {
      const passwordHash = await bcrypt.hash(user.password, 10)
      return new BlogUser({
        username: user.username,
        name: user.name,
        passwordHash: passwordHash,
      })
    })
  )

  await BlogUser.insertMany(usersWithHashedPasswords)
})


describe('Login API tests', () => {
  test('login succeeds with valid credentials', async () => {
    const loginDetails = {
      username: 'hellas',
      password: 'hell12%%'
    }

    const response = await api.post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.token)
    assert.strictEqual(response.body.username, 'hellas')
    assert.strictEqual(response.body.name, 'Arto Hellas')
  })

  test('login fails with invalid password', async () => {
    const loginDetails = {
      username: 'mluukkai',
      password: 'whatthe'
    }

    const response = await api.post('/api/login')
      .send(loginDetails)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
    assert.strictEqual(response.body.token, undefined)
  })

  test('login fails with non-existent username', async () => {
    const loginDetails = {
      username: 'nonexstentUser',
      password: 'somepassword',
    }

    const response = await api.post('/api/login')
      .send(loginDetails)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
    assert.strictEqual(response.body.token, undefined)
  })
})

after(async () => {
  await BlogUser.deleteMany({})
  await mongoose.connection.close()
})
