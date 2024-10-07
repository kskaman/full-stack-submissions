import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const EventNotification = () => {
  const { message, flag } = useSelector(state => state.notification)

  return message ? (
    <Alert variant={flag}>
      {message}
    </Alert>
  ) : null
}

export default EventNotification