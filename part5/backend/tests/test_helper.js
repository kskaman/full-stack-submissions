const Blog = require('../models/blog')
const BlogUser = require('../models/user')
const jwt = require('jsonwebtoken')

const initialUsers = [
  {
    username: 'hellas',
    name: 'Arto Hellas',
    password: 'hell12%%'
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'matLukK9#45'
  }
]

const initialBlogs = [
  {
    title : 'Things I Don\'t Know as of 2018',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
  },
  {
    title: 'Microservices and the First Law of Distributed Objects',
    author: 'Martin Fowler',
    url: 'htpps://martinfowler.com/articles/distributed-objects-microservices.html'
  }
]


const usersInDb = async () => {
  const users = await BlogUser.find({})
  return users.map(u => u.toJSON())
}


const generateTokenForUser = (user) => {
  const userForToken = {
    username: user.username,
    id: user.id,
  }
  console.log('User in generate Token for User : ', user)

  return jwt.sign(userForToken,
    process.env.SECRET,
    { expiresIn: 30*60 }
  )
}

const nonExistingId = async () => {
  const blog = new Blog({ content: 'this blog will be removed' })
  await blog.save()
  await blog.deleteOne()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialUsers,
  initialBlogs,
  usersInDb,
  generateTokenForUser,
  nonExistingId,
  blogsInDb
}