import { filterAction } from "../reducers/filterReducer"
import { useDispatch } from "react-redux"

const VisibilityFilter = () => {
  const dispatch = useDispatch()

  return <div style={{ padding: '0 0 10px' }}>
    filter <input 
      onChange={e => dispatch(filterAction(e.target.value))}/>
  </div>
}

export default VisibilityFilter