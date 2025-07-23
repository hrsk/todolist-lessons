import { createAppSlice } from "@/common/utils"
import { LoginInputs } from "@/features/auth/lib/schemas"
import { authApi } from "@/features/auth/api/authApi.ts"
import { setAppRequestStatus } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/types"
import { AUTH_TOKEN } from "@/common/constants"
import { handleServerError } from "@/common/utils/handleServerError.ts"
import { handleAppError } from "@/common/utils/handleAppError.ts"
import { clearData } from "@/common/actions"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: (create) => ({
    login: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          const res = await authApi.login(data)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
            localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            return {
              userId: res.data.data.userId,
              token: res.data.data.token,
              isLoggedIn: true,
            }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerError(error, dispatch)
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
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          const res = await authApi.logout()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
            dispatch(clearData())
            localStorage.removeItem(AUTH_TOKEN)
            return {
              isLoggedIn: false,
            }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerError(error, dispatch)
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
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          const res = await authApi.me()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
            return {
              isLoggedIn: true,
            }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerError(error, dispatch)
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
