import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }

  return (
    <div style={{ marginBottom: 10 }}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter