import { increaseVote } from "../reducers/anecdoteReducer"
import { useDispatch } from 'react-redux'

const Anecdote = ({ anecdote }) => {
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(increaseVote(id))
  }  
  
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote.id)}>vote</button>
      </div>
    </div>
  )
}
  
export default Anecdote


// // Define prop validation for Anecdote component
// Anecdote.propTypes = {
//   anecdote: PropTypes.shape({
//     content: PropTypes.string.isRequired,
//     votes: PropTypes.number.isRequired
//   }).isRequired,
//   handleVote: PropTypes.func.isRequired
// }