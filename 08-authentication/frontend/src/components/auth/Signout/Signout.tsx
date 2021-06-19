import { useEffect } from 'react'
import { useAppDispatch } from '../../../state/hooks'
import requireAuth from '../../requireAuth'
import { signOut } from '../authSlice'

const Signout = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(signOut())
  }, [dispatch])

  return <div>Sorry to see you go!</div>
}

export default requireAuth(Signout)
