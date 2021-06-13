import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  email: string
  password: string
}

export interface AuthState {
  /** Contains authentication token */
  authenticated: string
  /** Holds errors when authenticating user */
  errorMessage: string
}

const initialState = {
  authenticated: '',
  errorMessage: ''
} as AuthState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUp(state, action: PayloadAction<User>) {
      // TODO
    },

    signIn(state, action: PayloadAction<User>) {
      // TODO
    },

    signOut(state) {
      // TODO
    }
  }
})

export const { signUp, signIn, signOut } = authSlice.actions

export default authSlice.reducer
