import { createSlice } from "@reduxjs/toolkit"
import type { Nullable, RequestStatus } from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as Nullable<string>,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.status,
    selectAppError: (state) => state.error,
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
  }),
})

export const appReducer = appSlice.reducer
export const { changeThemeMode, setAppStatus, setAppError } = appSlice.actions
export const { selectThemeMode, selectAppStatus, selectAppError } = appSlice.selectors
// types
export type ThemeMode = "dark" | "light"
