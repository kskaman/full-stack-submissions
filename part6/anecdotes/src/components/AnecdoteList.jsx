import { useSelector } from 'react-redux'
import Anecdote from './Anecdote'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => 
    [...state].sort((a, b) => b.votes - a.votes) // Sort by votes
  )

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
        />
      )}
    </div>
  )
}

export default AnecdoteList
