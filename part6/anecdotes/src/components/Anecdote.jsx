import { useDispatch } from 'react-redux'
import { voteAnecdoteAsync } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote }) => {
  const dispatch = useDispatch()

  const handleVote = () => {
    dispatch(voteAnecdoteAsync(anecdote.id))
    dispatch(setNotificationWithTimeout(`You voted for: ${anecdote.content}`, 5))
  }

  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </div>
  )
}

export default Anecdote
