import { createAppSlice } from "@/common/utils"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"
import { setAppError, setAppStatus } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums"

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
      async (arg: { todolistId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatus({ status: "idle" }))
          const res = await tasksApi.getTasks(arg.todolistId)
          dispatch(setAppStatus({ status: "succeeded" }))
          return { todolistId: arg.todolistId, items: res.data.items }
        } catch (error) {
          dispatch(setAppStatus({ status: "failed" }))
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
      async (arg: { todolistId: string; taskId: string }, { dispatch, rejectWithValue }) => {
        const { todolistId, taskId } = arg
        try {
          dispatch(setAppStatus({ status: "pending" }))
          await tasksApi.deleteTask({ todolistId, taskId })
          dispatch(setAppStatus({ status: "succeeded" }))
          return { todolistId, taskId }
        } catch (error) {
          dispatch(setAppStatus({ status: "failed" }))
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
      async (arg: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        const { todolistId, title } = arg
        try {
          dispatch(setAppStatus({ status: "pending" }))
          const res = await tasksApi.createTask({ todolistId, title })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatus({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            dispatch(setAppError({ error: res.data.messages[0] }))
            dispatch(setAppStatus({ status: "failed" }))
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(setAppStatus({ status: "failed" }))
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
        { dispatch, rejectWithValue },
      ) => {
        const { todolistId, taskId, updateModel } = arg

        try {
          dispatch(setAppStatus({ status: "pending" }))
          const res = await tasksApi.updateTask({ todolistId, taskId, model: updateModel })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatus({ status: "succeeded" }))
            return { task: res.data.data.item }
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
