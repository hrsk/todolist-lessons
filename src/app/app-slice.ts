import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    isLoading: "idle" as RequestStatus,
    error: null as string | null,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectIsLoading: (state): RequestStatus => state.isLoading,
    selectAppError: (state) => state.error,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppRequestStatus: create.reducer<{ isLoading: RequestStatus }>((state, action) => {
      state.isLoading = action.payload.isLoading
    }),
    setAppError: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
  }),
})

export const { selectThemeMode, selectIsLoading, selectAppError } = appSlice.selectors
export const { changeThemeModeAC, setAppRequestStatus, setAppError } = appSlice.actions
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
