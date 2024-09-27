// src/components/AnecdoteList.jsx
import { useSelector } from 'react-redux'
import Anecdote from './Anecdote'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (!filter) {
      return anecdotes
    }
    return anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <Anecdote key={anecdote.id} anecdote={anecdote} />
      ))}
    </div>
  )
}

export default AnecdoteList
