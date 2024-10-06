const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')


const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
// use these middlewares before other controller files
app.use(middleware.requestLogger)

app.use('/api/blogs',
  middleware.tokenExtractor,
  middleware.userExtractor,
  blogsRouter
)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
