import { createSlice, nanoid } from "@reduxjs/toolkit"

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: {} as TasksState,
  },
  selectors: {
    selectTasks: (state) => state.tasks,
  },
  reducers: create => ({
    removeTask: create.reducer<{todolistId: string, taskId: string}>((state, action) => {
      const tasks = state.tasks[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),
    createTask: create.reducer<{todolistId: string, title: string}>((state, action) => {
      const newTask: Task = { title: action.payload.title, isDone: false, id: nanoid() }
      state.tasks[action.payload.todolistId].unshift(newTask)
    }),
    changeTaskStatus: create.reducer<{todolistId: string, taskId: string, isDone: boolean}>((state, action) => {
      const task = state.tasks[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.isDone = action.payload.isDone
      }
    }),
    changeTaskTitle: create.reducer<{todolistId: string, taskId: string, title: string}>((state, action) => {
      const task = state.tasks[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    })
  }),
  // extraReducers: builder => {
  //   builder.addCase(createTodolist, (state, action) => {
  //     state.tasks[action.payload.id] = []
  //   })
  //   builder.addCase(removeTodolist, (state, action) => {
  //     delete state.tasks[action.payload.todolistId]
  //   })
  // }
})

export const {removeTask, createTask, changeTaskStatus, changeTaskTitle} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>
