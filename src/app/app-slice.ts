import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    isLoading: "idle" as RequestStatus,
    error: null as string | null,
    isLoggedIn: false,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectIsLoading: (state): RequestStatus => state.isLoading,
    selectAppError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
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
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addMatcher(
        // (action) => {
        //   //попадают абсолютно все экшены
        //   console.log("predicate", action.type)
        //   //если true, то мы попадем в следующий callback
        //   return action.type.endsWith('/pending')
        // },
        isPending,
        (state, action) => {
          // console.log("reducer", action.type)
          if (
            todolistsApi.endpoints.getTodolists.matchPending(action)
            || tasksApi.endpoints.getTasks.matchPending(action)
          ) {
            return
          }
          state.isLoading = "loading"
        },
      )
      .addMatcher(
        // (action) => {
        //   //попадают абсолютно все экшены
        //   console.log("predicate", action.type)
        //   //если true, то мы попадем в следующий callback
        //   return action.type.endsWith("/fulfilled")
        // },
        isFulfilled,
        (state) => {
          // console.log("reducer", action.type)
          state.isLoading = "succeeded"
        },
      )
      .addMatcher(
        // (action) => {
        //   //попадают абсолютно все экшены
        //   console.log("predicate", action.type)
        //   //если true, то мы попадем в следующий callback
        //   return action.type.endsWith("/rejected")
        // },
        isRejected,
        (state, action) => {
          console.log("reducer", action.type)
          state.isLoading = "failed"
        },
      )
  },
})

export const { selectThemeMode, selectIsLoading, selectAppError, selectIsLoggedIn } = appSlice.selectors
export const { changeThemeModeAC, setAppRequestStatus, setAppError, setIsLoggedIn } = appSlice.actions
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
