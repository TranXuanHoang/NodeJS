import { Link } from 'react-router-dom'
import styles from './Header.module.scss'

const Header = () => {
  return <div className={styles.Header}>
    <Link to="/">Redux Auth</Link>
    <Link to="/signup">Sign Up</Link>
    <Link to="/signin">Sign In</Link>
    <Link to="/signout">Sign Out</Link>
    <Link to="/feature">Feature</Link>
  </div>
}

export default Header
