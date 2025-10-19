import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { tasksReducer, tasksSlice } from "@/features/todolists/model/tasks-slice"
import { todolistsReducer, todolistsSlice } from "@/features/todolists/model/todolists-slice"
import { appReducer, appSlice } from "@/app/app-slice.ts"

export const store = configureStore({
  reducer: combineReducers({
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store
