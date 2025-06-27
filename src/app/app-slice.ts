import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    isLoading: 'idle' as RequestStatus,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectIsLoading: (state): RequestStatus => state.isLoading,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    changeAppRequestStatus: create.reducer<{ isLoading: RequestStatus }>((state, action) => {
      state.isLoading = action.payload.isLoading
    }),
  }),
})

export const { selectThemeMode, selectIsLoading } = appSlice.selectors
export const { changeThemeModeAC, changeAppRequestStatus } = appSlice.actions
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
