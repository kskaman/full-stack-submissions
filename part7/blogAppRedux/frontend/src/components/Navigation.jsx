import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Navbar, Nav } from 'react-bootstrap'

const Navigation = ({ user, handleLogout }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="white">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as={Link} to="/">
            blogs
          </Nav.Link>
          <Nav.Link href="#" as={Link} to="/users">
            users
          </Nav.Link>
          <Nav.Link href="#" as="span">
            {user && (
              <>
                <span>{user.username} logged in</span> {/* Display the logged-in user's name */}
                <button onClick={handleLogout}>Logout</button> {/* Logout button */}
              </>
            )}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

Navigation.propTypes = {
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
}

export default Navigation
