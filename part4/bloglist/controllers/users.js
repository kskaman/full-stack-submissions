const bcrypt = require('bcrypt')
const User = require('../models/user')
const userRouter = require('express').Router()


userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validate that both username and password are provided
  // and are atleast 3 characters long
  if (!username || !password) {
    return response.status(400)
      .json({ error: 'Username and password are required' })
  }
  if (username.length < 3 || password.length < 3) {
    return response.status(400)
      .json({ error: 'Username and password must be atleast 3 characters long.' })
  }
  if (password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, url: 1, likes: 1 })

  response.json(users)
})

module.exports = userRouter