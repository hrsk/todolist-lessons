import { createAppSlice } from "@/common/utils"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {
    tasks: {} as TasksState,
  },
  selectors: {
    selectTasks: (state) => state.tasks,
  },
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async (arg: { todolistId: string }, { rejectWithValue }) => {
        try {
          const res = await tasksApi.getTasks(arg.todolistId)
          return { todolistId: arg.todolistId, items: res.data.items }
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        pending: () => {},
        fulfilled: (state, action) => {
          state.tasks[action.payload.todolistId] = action.payload.items
        },
        rejected: () => {},
        settled: () => {},
      },
    ),
    removeTask: create.asyncThunk(
      async (arg: { todolistId: string; taskId: string }, { rejectWithValue }) => {
        const { todolistId, taskId } = arg
        try {
          await tasksApi.deleteTask({ todolistId, taskId })
          return { todolistId, taskId }
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        pending: () => {},
        fulfilled: (state, action) => {
          const tasks = state.tasks[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    createTask: create.asyncThunk(
      async (arg: { todolistId: string; title: string }, { rejectWithValue }) => {
        const { todolistId, title } = arg
        try {
          const res = await tasksApi.createTask({ todolistId, title })
          return { task: res.data.data.item }
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        pending: () => {},
        fulfilled: (state, action) => {
          // const newTask: DomainTask = { action.payload.task }
          state.tasks[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),
    updateTask: create.asyncThunk(
      async (
        arg: { todolistId: string; taskId: string; updateModel: Partial<UpdateTaskModel> },
        { rejectWithValue },
      ) => {
        const { todolistId, taskId, updateModel } = arg

        try {
          const res = await tasksApi.updateTask({ todolistId, taskId, model: updateModel })
          return { task: res.data.data.item }
        } catch (e) {
          return rejectWithValue(e)
        }
      },
      {
        pending: () => {},
        fulfilled: (state, action) => {
          const task = state.tasks[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            if (task.title !== action.payload.task.title) {
              task.title = action.payload.task.title
            }
            if (task.status !== action.payload.task.status) {
              task.status = action.payload.task.status
            }
          }
        },
        rejected: () => {},
        settled: () => {},
      },
    ),
  }),
})

export const { fetchTasks, removeTask, createTask, updateTask } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
