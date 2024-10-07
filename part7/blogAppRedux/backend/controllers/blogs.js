const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = request.user // This is populated by middleware.userExtractor

  if (!user) {
    return response.status(401).json({ error: 'token invalid or missing' })
  }
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const createdBlog = await Blog.findById(savedBlog._id).populate('user')
    response.status(201).json(createdBlog)
  } catch {
    response.status(500).json({ error: 'Internal server error' })
  }
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})



blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, user: 1 })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token invalid or missin' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Check if the user trying to delete the blog is the same
  // as the one who created it
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({
      error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


// Route to fetch comments for a specific blog post
blogsRouter.get('/:id/comments', async (req, res) => {
  try {
    const blogId = req.params.id
    const blog = await Blog.findById(blogId)

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Send the comments associated with the blog
    res.json(blog.comments)
  } catch (error) {
    res.status(500).json({ error: `Something went wrong - ${error}` })
  }
})

// Route to add a comment to a blog post
blogsRouter.post('/:id/comments', async (request, response) => {
  try {
    const blogId = request.params.id
    const comment = request.body.content
    console.log(comment)
    // Find the blog by ID
    const blog = await Blog.findById(blogId)

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    // Add the new comment to the blog's comments array
    blog.comments = blog.comments.concat(comment)
    await blog.save()

    // Return the updated blog with comments
    response.status(201).json(blog)
  } catch (error) {
    response.status(500).json({ error: `Something went wrong - ${error}` })
  }
})


module.exports = blogsRouter