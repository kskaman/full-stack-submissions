const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


describe('most likes', () => {
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
      author: 'Author 1',
      likes: 10,
      __v: 0
    },
    {
      _id: '4',
      title: 'Blog 4',
      author: 'Author 2',
      likes: 4,
      __v: 0
    },
    {
      _id: '5',
      title: 'Blog 5',
      author: 'Author 3',
      likes: 15,
      __v: 0
    }
  ]

  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Author 3', likes: 15 })
  })
})