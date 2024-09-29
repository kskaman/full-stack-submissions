import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNotification } from '../NotificationContext'

const createAnecdote = async (newAnecdote) => {
  const response = await axios.post('http://localhost:3001/anecdotes', newAnecdote)
  return response.data
}

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [, notificationDispatch] = useNotification()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notificationDispatch({
        type: 'SHOW',
        payload: `Anecdote "${newAnecdote.content}" added`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    if (content.length >= 5) {
      newAnecdoteMutation.mutate({ content, votes: 0 })
    } else {
      notificationDispatch({
        type: 'SHOW',
        payload: 'Anecdote content must be at least 5 characters long',
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    }
  }

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
