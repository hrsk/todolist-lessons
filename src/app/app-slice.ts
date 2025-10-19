import { createSlice } from "@reduxjs/toolkit"
import type { RequestStatus } from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.status,
  },
  reducers: (create) => ({
    changeThemeMode: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
  }),
})

export const appReducer = appSlice.reducer
export const { changeThemeMode, setAppStatus } = appSlice.actions
export const { selectThemeMode, selectAppStatus } = appSlice.selectors
// types
export type ThemeMode = "dark" | "light"
