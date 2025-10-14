import { createSlice, nanoid } from "@reduxjs/toolkit"
import { DomainTodolist, Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: {
    todos: [] as DomainTodolist[],
  },
  selectors: {
    selectTodolists: (state) => state.todos,
  },
  reducers: (create) => ({
    getTodos: create.reducer<{items: Todolist[]}>((state, action) => {
      state.todos = action.payload.items.map(td => ({...td, filter: 'all'}))
    }),
    removeTodolist: create.reducer<{ todolistId: string }>((state, action) => {
      const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
      if (index !== -1) {
        state.todos.splice(index, 1)
      }
    }),
    createTodolist: create.preparedReducer(
      (title: string) => {
        const id = nanoid()
        return { payload: { id, title } }
      },
      (state, action) => {
        state.todos.push({ ...action.payload, filter: "all", order: 0, addedDate: '' })
      },
    ),
    changeTodolistTitle: create.reducer<{ todolistId: string; title: string }>((state, action) => {
      const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
      if (index !== -1) {
        state.todos[index].title = action.payload.title
      }
    }),
    changeTodolistFilter: create.reducer<{ todolistId: string; filter: FilterValues }>((state, action) => {
      const index = state.todos.findIndex((todolist) => todolist.id === action.payload.todolistId)
      if (index !== -1) {
        state.todos[index].filter = action.payload.filter
      }
    }),
  }),
})

export const { removeTodolist, createTodolist, changeTodolistFilter, changeTodolistTitle, getTodos } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type FilterValues = "all" | "active" | "completed"
