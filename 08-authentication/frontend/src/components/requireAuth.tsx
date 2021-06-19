import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useAppSelector } from "../state/hooks"

/**
 * A higher-order component checking whether the user is already authenticated.
 * If the user is authenticated, it returns the passed-in `WrappedComponent`.
 * Otherwise, it returns `null`.
 * Call this higher-order component function passing in a component that
 * you want to show it only if the user is authenticated.
 *
 * @param WrappedComponent The component to be returned if the user is authenticated.
 * @returns the input `WrappedComponent` if the user is authenticated, `null` otherwise.
 *
 * @see [Higher Order Composition with Typescript for React](https://www.pluralsight.com/guides/higher-order-composition-typescript-react)
 */
function requireAuth<T>(WrappedComponent: React.FC<T>) {
  return (props: T) => {
    const history = useHistory()
    const authenticated = useAppSelector(state => state.auth.authenticated)

    useEffect(() => {
      if (!authenticated) {
        // Navigate to the top page if unauthenticated
        history.push('/')
      }
    }, [history, authenticated])

    if (!authenticated) {
      // Calling history.push('/') here will cause a warning of
      // 'cannot update during an existing state transition'
      return null
    }

    return <WrappedComponent {...props} />
  }
}

export default requireAuth
