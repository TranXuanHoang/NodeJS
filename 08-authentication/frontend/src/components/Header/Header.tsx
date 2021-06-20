import { Link } from 'react-router-dom'
import { useAppSelector } from '../../state/hooks'
import styles from './Header.module.scss'

const Header = () => {
  const authenticated = useAppSelector(state => state.auth.authenticated)

  return <div className={styles.Header}>
    <Link to="/">Redux Auth</Link>
    {!authenticated
      ?
      <>
        <Link to="/signup">Sign Up</Link>
        <Link to="/signin">Sign In</Link>
      </>
      :
      <>
        <Link to="/signout">Sign Out</Link>
        <Link to="/feature">Feature</Link>
      </>
    }
  </div>
}

export default Header
