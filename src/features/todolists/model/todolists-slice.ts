import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import { createTodolistResponseSchema, Todolist, todolistSchema } from "@/features/todolists/api/todolistsApi.types"
import { createAppSlice } from "@/common/utils"
import { setAppError, setAppRequestStatus } from "@/app/app-slice.ts"
import { baseResponseWithEmptyObjectData, RequestStatus, ResultCode } from "@/common/types"
import { z } from "zod/v4"
import { handleServerError } from "@/common/utils/handleServerError.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    changeTodolistFilter: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    setEntityStatus: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    }),
    fetchTodolists: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          const res = await todolistsApi.getTodolists()
          todolistSchema.array().parse(res.data)
          dispatch(setAppRequestStatus({ isLoading: "succeeded" }))

          return { todolists: res.data }
        } catch (error) {
          handleServerError(error, dispatch)
          dispatch(setAppRequestStatus({ isLoading: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.map((td) => {
            state.push({ ...td, filter: "all", entityStatus: "idle" })
          })
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    createTodolist: create.asyncThunk(
      async (args: { title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          const res = await todolistsApi.createTodolist(args.title)
          createTodolistResponseSchema.parse(res.data)

          dispatch(setAppRequestStatus({ isLoading: "succeeded" }))

          return { todolist: res.data.data.item }
        } catch (error) {
          handleServerError(error, dispatch)
          dispatch(setAppRequestStatus({ isLoading: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    deleteTodolist: create.asyncThunk(
      async (args: { todolistId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          dispatch(setEntityStatus({ id: args.todolistId, entityStatus: "loading" }))
          const res = await todolistsApi.deleteTodolist(args.todolistId)
          baseResponseWithEmptyObjectData.parse(res.data)

          dispatch(setAppRequestStatus({ isLoading: "succeeded" }))

          return { todolist: res.data.data, todolistId: args.todolistId }
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.table(error.issues)
          }
          dispatch(setAppRequestStatus({ isLoading: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.todolistId)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    changeTodolistTitle: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          const res = await todolistsApi.changeTodolistTitle({ id: args.todolistId, title: args.title })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
          } else {
            dispatch(setAppError({ error: res.data.messages[0] }))
            dispatch(setAppRequestStatus({ isLoading: "failed" }))
          }
          return args
        } catch (error) {
          dispatch(setAppRequestStatus({ isLoading: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.todolistId)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
  }),extraReducers: builder => {
    // builder.addCase(clearData, () => {
    //   return []
    // })
  }
})

export const { selectTodolists } = todolistsSlice.selectors
export const {
  changeTodolistFilter,
  setEntityStatus,
  fetchTodolists,
  createTodolist,
  deleteTodolist,
  changeTodolistTitle,
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
