const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  // Additional test cases
  const listWithMultipleBlogs = [
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

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 20)
  })

  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})
