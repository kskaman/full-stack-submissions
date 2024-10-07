import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BlogForm from './BlogForm'

import { Table } from 'react-bootstrap'

const BlogsView = () => {
  const blogs = useSelector(state => state.blogs)

  const [showBlogForm, setShowBlogForm] = useState(false)

  return (
    <div>
      {/* Toggle button to show/hide BlogForm */}
      <button
        onClick={() => setShowBlogForm(!showBlogForm)}
        className="blog-create-button"
      >
        {showBlogForm ? 'Cancel' : 'Create new blog'}
      </button>

      {/* Conditionally render BlogForm or Blogs list */}
      {showBlogForm ? (
        <BlogForm />
      ) : (
        <Table striped>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default BlogsView