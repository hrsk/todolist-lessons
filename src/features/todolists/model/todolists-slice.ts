import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { createAppSlice } from "@/common/utils"
import { changeAppRequestStatus } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/types"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
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
    fetchTodolistsTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeAppRequestStatus({ isLoading: "loading" }))
          const res = await todolistsApi.getTodolists()
          dispatch(changeAppRequestStatus({ isLoading: "succeeded" }))

          return { todolists: res.data }
        } catch (error) {
          dispatch(changeAppRequestStatus({ isLoading: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.map((td) => {
            state.push({ ...td, filter: "all", entityStatus: 'idle' })
          })
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (args: { title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeAppRequestStatus({ isLoading: "loading" }))
          const res = await todolistsApi.createTodolist(args.title)
          dispatch(changeAppRequestStatus({ isLoading: "succeeded" }))

          return { todolist: res.data.data.item }
        } catch (error) {
          dispatch(changeAppRequestStatus({ isLoading: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: 'idle' })
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (args: { todolistId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeAppRequestStatus({ isLoading: "loading" }))
          dispatch(setEntityStatus({id: args.todolistId, entityStatus: 'loading'}))
          const res = await todolistsApi.deleteTodolist(args.todolistId)
          dispatch(changeAppRequestStatus({ isLoading: "succeeded" }))

          return { todolist: res.data.data, todolistId: args.todolistId }
        } catch (error) {
          dispatch(changeAppRequestStatus({ isLoading: "failed" }))
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
    changeTodolistTitleTC: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeAppRequestStatus({ isLoading: "loading" }))
          await todolistsApi.changeTodolistTitle({ id: args.todolistId, title: args.title })
          dispatch(changeAppRequestStatus({ isLoading: "succeeded" }))

          return args
        } catch (error) {
          dispatch(changeAppRequestStatus({ isLoading: "failed" }))
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
  }),
})

// export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_, thunkAPI) => {
//   try {
//     const res = await todolistsApi.getTodolists()
//     return { todolists: res.data }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(null)
//   }
// })

export const { selectTodolists } = todolistsSlice.selectors
export const { changeTodolistFilterAC, setEntityStatus, fetchTodolistsTC, createTodolistTC, deleteTodolistTC, changeTodolistTitleTC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
