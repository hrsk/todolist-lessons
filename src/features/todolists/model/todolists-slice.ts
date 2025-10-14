import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: {
    todos: [] as DomainTodolist[],
  },
  selectors: {
    selectTodolists: (state) => state.todos,
  },
  reducers: (create) => ({
    // setTodos: create.reducer<{ items: Todolist[] }>((state, action) => {
    //   state.todos = action.payload.items.map((td) => ({ ...td, filter: "all" }))
    // }),
    // removeTodolist: create.reducer<{ todolistId: string }>((state, action) => {
    //   const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
    //   if (index !== -1) {
    //     state.todos.splice(index, 1)
    //   }
    // }),
    // createTodolist: create.preparedReducer(
    //   (title: string) => {
    //     const id = nanoid()
    //     return { payload: { id, title } }
    //   },
    //   (state, action) => {
    //     state.todos.push({ ...action.payload, filter: "all", order: 0, addedDate: "" })
    //   },
    // ),
    // changeTodolistTitle: create.reducer<{ todolistId: string; title: string }>((state, action) => {
    //   const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
    //   if (index !== -1) {
    //     state.todos[index].title = action.payload.title
    //   }
    // }),
    changeTodolistFilter: create.reducer<{ todolistId: string; filter: FilterValues }>((state, action) => {
      const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
      if (index !== -1) {
        state.todos[index].filter = action.payload.filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload.items.map((td) => ({ ...td, filter: "all" }))
      })
      .addCase(fetchTodos.rejected, (_state, _action) => {})
      .addCase(updateTodolistTitle.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
        if (index !== -1) {
          state.todos[index].title = action.payload.title
        }
      })
      .addCase(updateTodolistTitle.rejected, (_state, _action) => {})
      .addCase(createTodolist.fulfilled, (state, action) => {
        state.todos.unshift({ ...action.payload.todolist, filter: "all" })
      })
      .addCase(createTodolist.rejected, (_state, _action) => {})
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
        if (index !== -1) {
          state.todos.splice(index, 1)
        }
      })
  },
})

export const fetchTodos = createAsyncThunk(`todolists/fetchTodos`, async (_arg, { rejectWithValue }) => {
  try {
    const res = await todolistsApi.getTodolists()
    return { items: res.data }
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const updateTodolistTitle = createAsyncThunk(
  `todolists/updateTodolistTitle`,
  async (
    arg: {
      todolistId: string
      title: string
    },
    { rejectWithValue },
  ) => {
    const { todolistId, title } = arg

    try {
      await todolistsApi.changeTodolistTitle({ id: todolistId, title })
      return { todolistId, title }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const createTodolist = createAsyncThunk(
  `todolists/createTodolist`,
  async (
    arg: {
      title: string
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await todolistsApi.createTodolist(arg.title)
      return { todolist: res.data.data.item }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
export const removeTodolist = createAsyncThunk(
  `todolists/removeTodolist`,
  async (
    arg: {
      todolistId: string
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await todolistsApi.deleteTodolist(arg.todolistId)
      return { data: res.data, todolistId: arg.todolistId }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const { changeTodolistFilter } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type FilterValues = "all" | "active" | "completed"
