import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Authenticated, User } from '../components/auth/authSlice'

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3090/' }),
  endpoints: (builder) => ({
    signup: builder.mutation<Authenticated, User>({
      query: (user: User) => ({ url: 'signup', method: 'POST', body: user }),
    }),
    signin: builder.mutation<Authenticated, User>({
      query: (user: User) => ({ url: 'signin', method: 'POST', body: user })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useSignupMutation,
  useSigninMutation
} = backendApi
