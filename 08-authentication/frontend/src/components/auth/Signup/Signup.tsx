import { Field, Form } from 'react-final-form'
import { useHistory } from 'react-router-dom'
import { useSignupMutation } from '../../../state/backendApi'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import Spinner from '../../Spinner/Spinner'
import { signUpFailed, signUpSuccessful, User } from '../authSlice'
import styles from './Signup.module.scss'

const someValuesUnset = (userCredential: User) => {
  return !userCredential.email || !userCredential.password
}

const allvaluesUnset = (userCredential: User) => {
  return !userCredential.email && !userCredential.password
}

const Signup = () => {
  const dispatch = useAppDispatch()
  const [signup, { isLoading, isError }] = useSignupMutation()
  const errorMessage = useAppSelector(state => state.auth.errorMessage)
  const history = useHistory()

  const onSubmit = async (userCredential: User) => {
    try {
      const response = await signup(userCredential).unwrap()
      dispatch(signUpSuccessful(response))
      history.push('/feature')
    } catch (err) {
      console.error(err)
      dispatch(signUpFailed(err.data.error))
    }
  }

  return (
    <Form
      // Will be passed in 'values' object as input argument
      onSubmit={onSubmit}
      initialValues={{ email: '', password: '' } as User}
      // 'handleSubmit' = 'onSubmit'
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          className={styles.Signup}
          autoComplete="off"
          onSubmit={handleSubmit}>
          <div className={styles.Header}>Register a New Account</div>
          <label className={styles.EmailLabel}>Email</label>
          <Field name="email"
            component="input"
            type="text"
            placeholder="Email"
            className={styles.EmailInput}
          />
          <label className={styles.PasswordLabel}>Password</label>
          <Field name="password"
            component="input"
            type="password"
            placeholder="Password"
            className={styles.PasswordInput}
          />
          <div className={styles.ActionButtons}>
            {isLoading
              ? <Spinner />
              : <>
                {isError && <div className={styles.Error}>{errorMessage}</div>}
                <button type="submit"
                  disabled={submitting || pristine || someValuesUnset(values)}
                >
                  Sign Up
                </button>
                <button type="reset"
                  onClick={e => form.reset()}
                  disabled={submitting || pristine || allvaluesUnset(values)}
                >
                  Reset
                </button>
              </>
            }
          </div>
        </form>
      )}
    />
  )
}

export default Signup
