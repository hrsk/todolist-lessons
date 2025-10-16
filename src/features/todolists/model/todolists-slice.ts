import { createAppSlice } from "@/common/utils"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"

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
      async (_arg, { rejectWithValue }) => {
        try {
          const res = await todolistsApi.getTodolists()
          return { items: res.data }
        } catch (e) {
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
      async (arg: { todolistId: string; title: string }, { rejectWithValue }) => {
        const { todolistId, title } = arg
        try {
          await todolistsApi.changeTodolistTitle({ id: todolistId, title })
          return { todolistId, title }
        } catch (e) {
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
      async (arg: { title: string }, { rejectWithValue }) => {
        try {
          const res = await todolistsApi.createTodolist(arg.title)
          return { todolist: res.data.data.item }
        } catch (e) {
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
      async (arg: { todolistId: string }, { rejectWithValue }) => {
        try {
          const res = await todolistsApi.deleteTodolist(arg.todolistId)
          return { data: res.data, todolistId: arg.todolistId }
        } catch (e) {
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
