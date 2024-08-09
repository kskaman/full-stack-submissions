const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current), {})
}

const mostBlogs = (blogs) => {
  const authors = {}
  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(authors).reduce((prev, current) =>
    authors[prev] > authors[current] ? prev : current)

  return { author: topAuthor, blogs: authors[topAuthor] }
}

const mostLikes = (blogs) => {
  const authors = {}
  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes
  })

  const topAuthor = Object.keys(authors).reduce((prev, current) =>
    authors[prev] > authors[current] ? prev : current)

  return { author: topAuthor, likes: authors[topAuthor] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
