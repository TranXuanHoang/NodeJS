import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSigninMutation } from '../../../state/backendApi'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import Spinner from '../../Spinner/Spinner'
import { signInFailed, signInSuccessful, User } from '../authSlice'
import styles from './Signin.module.scss'

const someValuesUnset = (userCredential: User) => {
  return !userCredential.email || !userCredential.password
}

const allvaluesUnset = (userCredential: User) => {
  return !userCredential.email && !userCredential.password
}

const Signin = () => {
  // Local state to hold email and password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useAppDispatch()
  const errorMessage = useAppSelector(state => state.auth.errorMessage)

  // To call backend '/signin' API
  const [signin, { isLoading, isError }] = useSigninMutation()

  // Handle route navigation
  const history = useHistory()

  const onSubmit = async (userCredential: User) => {
    try {
      const response = await signin(userCredential).unwrap()
      dispatch(signInSuccessful(response))
      history.push('/feature')
    } catch (err) {
      console.error(err)
      dispatch(signInFailed('Could not login!'))
    }
  }

  const onReset = () => {
    setEmail('')
    setPassword('')
  }

  return (
    <form
      className={styles.Signin}
      autoComplete="off"
      onSubmit={e => {
        e.preventDefault()
        onSubmit({ email, password })
      }}>
      <div className={styles.Header}>Log In</div>
      <label className={styles.EmailLabel}>Email</label>
      <input name="email"
        type="text"
        placeholder="Email"
        className={styles.EmailInput}
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label className={styles.PasswordLabel}>Password</label>
      <input name="password"
        type="password"
        placeholder="Password"
        className={styles.PasswordInput}
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div className={styles.ActionButtons}>
        {isLoading
          ? <Spinner />
          : <>
            {isError && <div className={styles.Error}>{errorMessage}</div>}
            <button type="submit"
              disabled={someValuesUnset({ email, password })}
            >
              Sign In
            </button>
            <button type="reset"
              onClick={onReset}
              disabled={allvaluesUnset({ email, password })}
            >
              Reset
            </button>
          </>
        }
      </div>
    </form>
  )
}

export default Signin
