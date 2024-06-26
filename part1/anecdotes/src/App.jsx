import { useState } from 'react'


const Anecdote = ({ text, votes }) => (
  <div>
    <div>{text}</div>
    <div>has {votes} votes</div>
  </div>
)


const VotingButtons = ({ onVote, onNext }) => (
  <div>
    <button onClick={onVote}>vote</button>
    <button onClick={onNext}>next anecdote</button>
  </div>
)



const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const n = anecdotes.length

  const randomNumber = () => (
    Math.floor(Math.random() * n)
  )

  const getMaxIndex = (votes) => {
    return votes.reduce((maxIndex, currentValue, currentIndex, array) => {
      return currentValue > array[maxIndex] ? currentIndex : maxIndex
    }, 0)
  }

  const [votes, setVotes] = useState(new Array(n).fill(0))
  const [selected, setSelected] = useState(randomNumber())
  const [maxIndex, setMaxIndex] = useState(0)
    
  const handleVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
    setMaxIndex(getMaxIndex(newVotes))
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
      <VotingButtons onVote={handleVote} onNext={() => setSelected(randomNumber())} />

      <h1>Anecdote with most votes</h1>
      <Anecdote text={anecdotes[maxIndex]} votes={votes[maxIndex]} />
    </div>
  )
}

export default App