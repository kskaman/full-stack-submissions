const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Author 1',
      likes: 3,
      __v: 0
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Author 2',
      likes: 7,
      __v: 0
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      likes: 10,
      __v: 0
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      likes: 10,
      __v: 0
    })
  })
})