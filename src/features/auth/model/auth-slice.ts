import { createAppSlice } from "@/common/utils"
import { LoginInputs } from "@/features/auth/lib/schemas"
import { authApi } from "@/features/auth/api/authApi.ts"
import { setAppRequestStatus } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/types"
import { AUTH_TOKEN } from "@/common/constants"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: (create) => ({
    login: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        dispatch(setAppRequestStatus({ isLoading: "loading" }))

        const res = await authApi.login({
          email: data.email,
          password: data.password,
          captcha: data.captcha,
          rememberMe: data.rememberMe,
        })

        try {
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
            localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            return {
              userId: res.data.data.userId,
              token: res.data.data.token,
              isLoggedIn: true,
            }
          } else {
            return rejectWithValue(null)
          }
        } catch (e) {
          return rejectWithValue(null)
        } finally {
          dispatch(setAppRequestStatus({ isLoading: "idle" }))
        }
        // логика санки для авторизации
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logout: create.asyncThunk(
      async (_args, { dispatch, rejectWithValue }) => {
        dispatch(setAppRequestStatus({ isLoading: "loading" }))

        const res = await authApi.logout()

        try {
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
            localStorage.removeItem(AUTH_TOKEN)
            return {
              isLoggedIn: false,
            }
          } else {
            return rejectWithValue(null)
          }
        } catch (e) {
          return rejectWithValue(null)
        } finally {
          dispatch(setAppRequestStatus({ isLoading: "idle" }))
        }
        // логика санки для авторизации
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    authMe: create.asyncThunk(
      async (_args, { dispatch, rejectWithValue }) => {
        dispatch(setAppRequestStatus({ isLoading: "loading" }))

        const res = await authApi.me()

        try {
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
            return {
              isLoggedIn: true,
            }
          } else {
            return rejectWithValue(null)
          }
        } catch (e) {
          return rejectWithValue(null)
        } finally {
          dispatch(setAppRequestStatus({ isLoading: "idle" }))
        }
        // логика санки для авторизации
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
  }),
  selectors: { selectIsLoggedIn: (state) => state.isLoggedIn },
})

export const { selectIsLoggedIn } = authSlice.selectors
export const { login, logout, authMe } = authSlice.actions
export const authReducer = authSlice.reducer
