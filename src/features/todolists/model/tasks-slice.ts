import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { current } from "@reduxjs/toolkit"
import { RootState } from "@/app/store.ts"
import { TaskPriority, TaskStatus } from "@/common/enums"
import { changeAppRequestStatus } from "@/app/app-slice.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
  },
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeAppRequestStatus({ isLoading: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          dispatch(changeAppRequestStatus({ isLoading: "succeeded" }))
          return { todolistId, tasks: res.data.items }
        } catch (error) {
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
    createTaskThunk: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeAppRequestStatus({ isLoading: "loading" }))
          const res = await tasksApi.createTask(args)
          dispatch(changeAppRequestStatus({ isLoading: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          // const {title, todoListId} = action.payload.task
          // const newTask: DomainTask = {
          //   title,
          //   status: TaskStatus.New,
          //   id: nanoid(),
          //   priority: TaskPriority.Urgently,
          //   order: 0,
          //   description: "",
          //   deadline: "",
          //   addedDate: "",
          //   todoListId,
          //   startDate: "",
          // }
          // state[todoListId].unshift(newTask)
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    changeTaskStatusThunk: create.asyncThunk(
      async (args: { todolistId: string; taskId: string; status: TaskStatus }, thunkAPI) => {
        const { getState } = thunkAPI

        try {
          const tasks = (getState() as RootState).tasks

          const tasksForTodo = tasks[args.todolistId]
          const findTask = tasksForTodo.find((task) => task.id === args.taskId)

          if (findTask) {
            const model: UpdateTaskModel = {
              title: findTask.title,
              status: args.status,
              priority: TaskPriority.Urgently,
              startDate: findTask.startDate,
              description: findTask.description,
              deadline: findTask.deadline,
            }

            const res = await tasksApi.updateTask({ todolistId: findTask.todoListId, taskId: findTask.id, model })
            return { task: res.data.data.item }
          } else return thunkAPI.rejectWithValue("error")
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },

      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
          }

          if (task) console.log(current(state[task.todoListId]))
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    changeTaskStatusModelThunk: create.asyncThunk(
      async (task: DomainTask, thunkAPI) => {
        try {
          const model: UpdateTaskModel = {
            title: task.title,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            description: task.description,
            deadline: task.deadline,
          }
          const res = await tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model })
          return { task: res.data.data.item }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
          }

          if (task) console.log(current(state[task.todoListId]))
        },
        rejected: (_) => {
          // если ошибка
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (arg: { todolistId: string; taskId: string }, { rejectWithValue }) => {
        await tasksApi.deleteTask(arg)
        try {
          return { todolistId: arg.todolistId, taskId: arg.taskId }
        } catch (e) {
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
    changeTaskTitleTC: create.asyncThunk(
      async (task: DomainTask, { rejectWithValue }) => {
        try {
          const model: UpdateTaskModel = {
            title: task.title,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            description: task.description,
            deadline: task.deadline,
          }

          const res = await tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model })
          return { task: res.data.data.item }
        } catch (e) {
          return rejectWithValue(e)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.title = action.payload.task.title
          }
        },
      },
    ),
    changeTask: create.asyncThunk(
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

            dispatch(changeAppRequestStatus({ isLoading: "loading" }))
            const res = await tasksApi.updateTask({
              todolistId: findTask.todoListId,
              taskId: findTask.id,
              model: updateModel,
            })
            dispatch(changeAppRequestStatus({ isLoading: "succeeded" }))
            return { task: res.data.data.item }
          } else return rejectWithValue("error")
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
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
    // deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
    //   const tasks = state[action.payload.todolistId]
    //   const index = tasks.findIndex((task) => task.id === action.payload.taskId)
    //   if (index !== -1) {
    //     tasks.splice(index, 1)
    //   }
    // }),
    // createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
    //   const newTask: DomainTask = {
    //     title: action.payload.title,
    //     status: TaskStatus.New,
    //     id: nanoid(),
    //     priority: TaskPriority.Urgently,
    //     order: 0,
    //     description: "",
    //     deadline: "",
    //     addedDate: "",
    //     todoListId: action.payload.todolistId,
    //     startDate: "",
    //   }
    //   state[action.payload.todolistId].unshift(newTask)
    // }),
    // changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
    //   const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
    //   if (task) {
    //     task.status = action.payload.isDone ? TaskStatus.Completed : TaskStatus.InProgress
    //   }
    // }),
    // changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
    //   const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
    //   if (task) {
    //     task.title = action.payload.title
    //   }
    // }),
  }),
})

export const { selectTasks } = tasksSlice.selectors
export const {
  deleteTaskTC,
  changeTaskTitleTC,
  fetchTasks,
  createTaskThunk,
  changeTaskStatusThunk,
  changeTaskStatusModelThunk,
  changeTask,
} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

// export type Task = {
//   id: string
//   title: string
//   isDone: boolean
// }

export type TasksState = Record<string, DomainTask[]>
