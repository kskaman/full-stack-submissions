import PropTypes from 'prop-types'

const EventNotification = ({ message, flag }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`message ${flag}`} >
      {message}
    </div>
  )
}

EventNotification.propTypes = {
  message: PropTypes.string,
  flag: PropTypes.string
}

EventNotification.defaultProps = {
  flag: ''
}

export default EventNotification