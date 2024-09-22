import PropTypes from 'prop-types'

const EventNotification = ({ message, flag }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`message ${flag}`} data-testid="errorMessage" >
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