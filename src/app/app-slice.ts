import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import type { Nullable, RequestStatus } from "@/common/types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as Nullable<string>,
    isLoggedIn: false,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.status,
    selectAppError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    changeThemeMode: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppError: create.reducer<{ error: Nullable<string> }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, _action) => {
        state.status = "pending"
      })
      .addMatcher(isFulfilled, (state, _action) => {
        state.status = "succeeded"
      })
      .addMatcher(isRejected, (state, _action) => {
        state.status = "failed"
      })
      .addMatcher(isPending, (state, action) => {
        if (todolistsApi.endpoints.getTodos.matchPending(action) || tasksApi.endpoints.getTasks.matchPending(action)) {
          return
        }
        state.status = "pending"
      })
  },
})

export const appReducer = appSlice.reducer
export const { changeThemeMode, setAppStatus, setAppError, setIsLoggedIn } = appSlice.actions
export const { selectThemeMode, selectAppStatus, selectAppError, selectIsLoggedIn } = appSlice.selectors
// types
export type ThemeMode = "dark" | "light"
