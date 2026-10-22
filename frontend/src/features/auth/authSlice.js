import { createSlice } from '@reduxjs/toolkit'

const storedUser = localStorage.getItem('labcare_user')
const storedToken = localStorage.getItem('labcare_token')

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken),
}

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true

      localStorage.setItem(
        'labcare_user',
        JSON.stringify(action.payload.user)
      )

      localStorage.setItem(
        'labcare_token',
        action.payload.token
      )
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      localStorage.removeItem('labcare_user')
      localStorage.removeItem('labcare_token')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions

export default authSlice.reducer