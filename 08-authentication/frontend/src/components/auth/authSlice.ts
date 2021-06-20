import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  email: string
  password: string
}

export interface Authenticated {
  token: string
}

export interface AuthState {
  /** Contains authentication token */
  authenticated: string
  /** Holds errors when authenticating user */
  errorMessage: string
}

const initialState = {
  authenticated: localStorage.getItem('token') || '',
  errorMessage: ''
} as AuthState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUpSuccessful(state, action: PayloadAction<Authenticated>) {
      state.authenticated = action.payload.token
      state.errorMessage = ''
      localStorage.setItem('token', state.authenticated)
    },

    signUpFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload
      state.authenticated = ''
      localStorage.removeItem('token')
    },

    signInSuccessful(state, action: PayloadAction<Authenticated>) {
      state.authenticated = action.payload.token
      state.errorMessage = ''
      localStorage.setItem('token', state.authenticated)
    },

    signInFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload
      state.authenticated = ''
      localStorage.removeItem('token')
    },

    signOut(state) {
      state.authenticated = ''
      localStorage.removeItem('token')
    }
  }
})

export const {
  signUpSuccessful,
  signUpFailed,
  signInSuccessful,
  signInFailed,
  signOut
} = authSlice.actions

export default authSlice.reducer
