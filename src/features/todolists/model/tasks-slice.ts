import { createTodolist, deleteTodolist } from "./todolists-slice"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, getTasksSchema, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { RootState } from "@/app/store.ts"
import { setAppRequestStatus } from "@/app/app-slice.ts"
import { baseResponseWithEmptyObjectData, ResultCode, taskResponseSchema } from "@/common/types"
import { handleAppError } from "@/common/utils/handleAppError.ts"
import { handleServerError } from "@/common/utils/handleServerError.ts"
import { z } from "zod/v4"
import { clearData } from "@/common/actions"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(clearData, () => {
        return {}
      })
  },
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          getTasksSchema.parse(res.data) // ZOD
          dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.table(error.issues)
          }
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    createTask: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppRequestStatus({ isLoading: "loading" }))
          const res = await tasksApi.createTask(args)

          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
            taskResponseSchema.parse(res.data)
            return { task: res.data.data.item }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    deleteTask: create.asyncThunk(
      async (arg: { todolistId: string; taskId: string }, { dispatch, rejectWithValue }) => {
        const res = await tasksApi.deleteTask(arg)
        try {
          baseResponseWithEmptyObjectData.parse(res)

          return { todolistId: arg.todolistId, taskId: arg.taskId }
        } catch (e) {
          handleServerError(e, dispatch)
          return rejectWithValue(e)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    updateTask: create.asyncThunk(
      async (args: { todolistId: string; taskId: string; updateTaskModel: UpdateTaskModel }, thunkAPI) => {
        const { dispatch, rejectWithValue, getState } = thunkAPI

        try {
          const tasks = (getState() as RootState).tasks

          const tasksForTodo = tasks[args.todolistId]
          const findTask = tasksForTodo.find((task) => task.id === args.taskId)

          if (findTask) {
            const updateModel: UpdateTaskModel = {
              title: args.updateTaskModel.title,
              status: args.updateTaskModel.status,
              priority: findTask.priority,
              startDate: findTask.startDate,
              description: findTask.description,
              deadline: findTask.deadline,
            }

            dispatch(setAppRequestStatus({ isLoading: "loading" }))
            const res = await tasksApi.updateTask({
              todolistId: findTask.todoListId,
              taskId: findTask.id,
              model: updateModel,
            })

            if (res.data.resultCode === ResultCode.Success) {
              taskResponseSchema.parse(res.data) // ZOD
              dispatch(setAppRequestStatus({ isLoading: "succeeded" }))
              return { task: res.data.data.item }
            } else {
              handleAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          }
        } catch (error: any) {
          handleServerError(error, dispatch)
        }
        return thunkAPI.rejectWithValue(null)
      },

      {
        fulfilled: (state, action) => {
          let task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
          }

          if (task) {
            task.title = action.payload.task.title
          }
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
  }),
})

export const { selectTasks } = tasksSlice.selectors
export const { deleteTask, fetchTasks, createTask, updateTask } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
