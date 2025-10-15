import { TaskStatus } from "@/common/enums"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"
import { RootState } from "@/app/store.ts"

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
    changeTaskStatus: create.asyncThunk(
      async (arg: { todolistId: string; taskId: string; status: TaskStatus }, { rejectWithValue, getState }) => {
        const { todolistId, taskId, status } = arg

        const allTodolistTasks = (getState() as RootState).tasks
        const task = allTodolistTasks.tasks[todolistId].find((task) => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        const updateModel: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status,
        }

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
          debugger
          const task = state.tasks[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
          }
        },
        rejected: () => {},
        settled: () => {},
      },
    ),
    changeTaskTitle: create.asyncThunk(
      async (arg: { todolistId: string; taskId: string; title: string }, { rejectWithValue, getState }) => {
        const { todolistId, taskId, title } = arg

        const allTodolistTasks = (getState() as RootState).tasks
        const task = allTodolistTasks.tasks[todolistId].find((task) => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        const updateModel: UpdateTaskModel = {
          description: task.description,
          title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
        }

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
          debugger
          const task = state.tasks[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.title = action.payload.task.title
          }
        },
        rejected: () => {},
        settled: () => {},
      },
    ),
    // removeTask: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
    //   const tasks = state.tasks[action.payload.todolistId]
    //   const index = tasks.findIndex((task) => task.id === action.payload.taskId)
    //   if (index !== -1) {
    //     tasks.splice(index, 1)
    //   }
    // }),
    // createTask: create.reducer<{ todolistId: string; title: string }>((state, action) => {
    //   const newTask: DomainTask = {
    //     title: action.payload.title,
    //     todoListId: action.payload.todolistId,
    //     startDate: "",
    //     priority: TaskPriority.Low,
    //     description: "",
    //     deadline: "",
    //     status: TaskStatus.New,
    //     addedDate: "",
    //     order: 0,
    //     id: nanoid(),
    //   }
    //   state.tasks[action.payload.todolistId].unshift(newTask)
    // }),
    // changeTaskStatus: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
    //   const task = state.tasks[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
    //   if (task) {
    //     task.status = action.payload.isDone ? TaskStatus.Completed : TaskStatus.New
    //   }
    // }),
    // changeTaskTitle: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
    //   const task = state.tasks[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
    //   if (task) {
    //     task.title = action.payload.title
    //   }
    // }),
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

export const { fetchTasks, removeTask, createTask, changeTaskStatus, changeTaskTitle } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
