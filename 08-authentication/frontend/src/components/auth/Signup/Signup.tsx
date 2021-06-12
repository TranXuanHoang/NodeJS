import styles from './Signup.module.scss'

const Signup = () => {
  return (
    <form className={styles.Signup}>
      <fieldset>
        <label>Email</label>
      </fieldset>
      <fieldset>
        <label>Password</label>
      </fieldset>
    </form>
  )
}

export default Signup
