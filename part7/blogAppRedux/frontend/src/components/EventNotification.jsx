import { useSelector } from 'react-redux'

const EventNotification = () => {
  const { message, flag } = useSelector(state => state.notification)

  return message ? (
    <div className={`message ${flag}`}>
      {message}
    </div>
  ) : null
}

export default EventNotification