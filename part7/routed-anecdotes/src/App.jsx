import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import { useField, useResource } from './hooks'
import PropTypes from 'prop-types'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create" style={padding}>create new</Link>
      <Link to="/about" style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
)

AnecdoteList.propTypes = {
  anecdotes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      content: PropTypes.string.isRequired
    })
  ).isRequired
}

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find(a => a.id === Number(id) || a.id === id)

  if (!anecdote) return <div>Anecdote not found</div>

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>by {anecdote.author}</p>
      <p>for more info, see <a href={anecdote.info}>{anecdote.info}</a></p>
      <p>has {anecdote.votes} votes</p>
    </div>
  )
}

Anecdote.propTypes = {
  anecdotes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired
    })
  ).isRequired
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself.</em>

    <p>Software engineering is full of excellent anecdotes, and at this app, you can find the best ones and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for Full Stack Open.<br />
    See <a href="https://github.com/fullstack-hy2020">here</a> for the source code.
  </div>
)

const CreateNew = ({ addNew }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        content: <input {...content.fieldProps} /> <br />
        author: <input {...author.fieldProps} /> <br />
        url for more info: <input {...info.fieldProps} /> <br />
        <button>create</button>
        <button type="button" onClick={() => {
          content.reset()
          author.reset()
          info.reset()
        }}>reset</button>
      </form>
    </div>
  )
}

CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired
}

const App = () => {
  const [anecdotes, anecdoteService] = useResource('http://localhost:3001/anecdotes')
  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdoteService.create(anecdote)
    setNotification(`Anecdote '${anecdote.content}' created!`)
    setTimeout(() => setNotification(''), 5000)
  }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        {notification && <div>{notification}</div>}
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
