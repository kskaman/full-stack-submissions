const Blog = require('../models/blog')

const initialBlogs = [
  {
    title : 'My First Blog Post',
    author : 'John Doe',
    url : 'http://example.com',
  },
]

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
  initialBlogs, nonExistingId, blogsInDb
}