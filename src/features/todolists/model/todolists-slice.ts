import { createAppSlice } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { setAppError, setAppStatus } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: {
    todos: [] as DomainTodolist[],
  },
  selectors: {
    selectTodolists: (state) => state.todos,
  },
  reducers: (create) => ({
    fetchTodos: create.asyncThunk(
      async (_arg, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatus({ status: "pending" }))
          const res = await todolistsApi.getTodolists()
          dispatch(setAppStatus({ status: "succeeded" }))
          return { items: res.data }
        } catch (e) {
          dispatch(setAppStatus({ status: "failed" }))
          return rejectWithValue(e)
        }
      },
      {
        pending: () => {},
        rejected: () => {},
        fulfilled: (state, action) => {
          state.todos = action.payload.items.map((td) => ({ ...td, filter: "all" }))
        },
        settled: () => {},
      },
    ),
    updateTodolistTitle: create.asyncThunk(
      async (arg: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        const { todolistId, title } = arg
        try {
          dispatch(setAppStatus({ status: "pending" }))

          const res = await todolistsApi.changeTodolistTitle({ id: todolistId, title })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatus({ status: "succeeded" }))
            return { todolistId, title }
          } else {
            dispatch(setAppError({ error: res.data.messages[0] }))
            dispatch(setAppStatus({ status: "failed" }))
            return rejectWithValue(null)
          }
        } catch (e) {
          dispatch(setAppStatus({ status: "failed" }))
          return rejectWithValue(e)
        }
      },
      {
        pending: () => {},
        fulfilled: (state, action) => {
          const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
          if (index !== -1) {
            state.todos[index].title = action.payload.title
          }
        },
        rejected: () => {},
        settled: () => {},
      },
    ),
    createTodolist: create.asyncThunk(
      async (arg: { title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatus({ status: "pending" }))
          const res = await todolistsApi.createTodolist(arg.title)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatus({ status: "succeeded" }))
            return { todolist: res.data.data.item }
          } else {
            dispatch(setAppError({ error: res.data.messages[0] }))
            dispatch(setAppStatus({ status: "failed" }))
            return rejectWithValue(null)
          }
        } catch (e) {
          dispatch(setAppStatus({ status: "failed" }))
          return rejectWithValue(e)
        }
      },
      {
        pending: () => {},
        fulfilled: (state, action) => {
          state.todos.unshift({ ...action.payload.todolist, filter: "all" })
        },
        rejected: () => {},
        settled: () => {},
      },
    ),
    removeTodolist: create.asyncThunk(
      async (arg: { todolistId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatus({ status: "pending" }))
          const res = await todolistsApi.deleteTodolist(arg.todolistId)
          dispatch(setAppStatus({ status: "succeeded" }))
          return { data: res.data, todolistId: arg.todolistId }
        } catch (e) {
          dispatch(setAppStatus({ status: "failed" }))
          return rejectWithValue(e)
        }
      },
      {
        pending: () => {},
        fulfilled: (state, action) => {
          const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
          if (index !== -1) {
            state.todos.splice(index, 1)
          }
        },
        rejected: () => {},
        settled: () => {},
      },
    ),
    changeTodolistFilter: create.reducer<{ todolistId: string; filter: FilterValues }>((state, action) => {
      const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
      if (index !== -1) {
        state.todos[index].filter = action.payload.filter
      }
    }),
  }),
})

export const { fetchTodos, changeTodolistFilter, createTodolist, removeTodolist, updateTodolistTitle } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type FilterValues = "all" | "active" | "completed"
