import { beforeEach, expect, test } from "vitest"
import { changeTask, createTaskThunk, deleteTaskTC, tasksReducer, type TasksState } from "../tasks-slice"
import { TaskPriority, TaskStatus } from "@/common/enums"
import { nanoid } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"

let startState: TasksState = {}

const taskDefaultValues = {
  description: "",
  deadline: "",
  addedDate: "",
  startDate: "",
  priority: TaskPriority.Low,
  order: 0,
}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  }
})


test("correct task should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled(
      {
        todolistId: "todolistId2",
        taskId: "2",
      },
      "requestId",
      { todolistId: "todolistId2", taskId: "2" },
    ),
  )

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  })
})

test("correct task should be created at correct array", () => {
  const endState = tasksReducer(
    startState,
    createTaskThunk.fulfilled(
      {
        task: {
          id: nanoid(),
          title: "juice",
          status: TaskStatus.New,
          todoListId: "todolistId2",
          ...taskDefaultValues,
        },
      },
      "requestId",
      { todolistId: "todolistId2", title: "juice" },
    ),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its status", () => {
  const updateModel = {
    ...taskDefaultValues,
    title: "CSS",
    status: TaskStatus.Completed,
  }

  const endState = tasksReducer(
    startState,
    changeTask.fulfilled(
      {
        task: { ...taskDefaultValues, todoListId: "todolistId1", id: "1", status: TaskStatus.Completed, title: "CSS" },
      },
      "requestId",
      {
        todolistId: "todolistId1",
        taskId: "1",
        updateTaskModel: updateModel,
      },
    ),
  )

  expect(endState.todolistId1[0].status).toBe(TaskStatus.Completed)
  expect(endState.todolistId1[0].title).toBe("CSS")
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed)
  expect(endState.todolistId1[1].title).toBe("JS")
})

test("correct task should change its title", () => {
  const updateModel = {
    ...taskDefaultValues,
    title: "coffee",
    status: TaskStatus.New,
  }

  const endState = tasksReducer(
    startState,
    changeTask.fulfilled(
      {
        task: { ...taskDefaultValues, todoListId: "todolistId2", id: "1", status: TaskStatus.New, title: "coffee" },
      },
      "requestId",
      {
        todolistId: "todolistId2",
        taskId: "1",
        updateTaskModel: updateModel,
      },
    ),
  )

  expect(endState.todolistId2[0].title).toBe("coffee")
  expect(endState.todolistId2[1].title).toBe("milk")
  expect(endState.todolistId1[1].title).toBe("JS")
})

test("array should be created for new todolist", () => {
  const endState = tasksReducer(
    startState,
    createTodolistTC.fulfilled(
      {
        todolist: {
          id: nanoid(),
          title: "",
          addedDate: "",
          order: 0,
        },
      },
      "requestId",
      { title: "" },
    ),
  )

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTodolistTC.fulfilled(
      {
        todolist: {},
        todolistId: "todolistId2",
      },
      "requestId",
      { todolistId: "todolistId2" },
    ),
  )

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
