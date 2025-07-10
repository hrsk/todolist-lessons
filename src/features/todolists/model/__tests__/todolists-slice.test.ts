import { nanoid } from "@reduxjs/toolkit"
import { beforeEach, expect, test } from "vitest"
import {
  changeTodolistFilter,
  changeTodolistTitle,
  createTodolist,
  deleteTodolist,
  DomainTodolist,
  todolistsReducer,
} from "../todolists-slice"

let todolistId1: string
let todolistId2: string
let startState: DomainTodolist[] = []

beforeEach(() => {
  todolistId1 = nanoid()
  todolistId2 = nanoid()

  startState = [
    { id: todolistId1, title: "What to learn", addedDate: "", order: 0, filter: "all", entityStatus: "idle" },
    { id: todolistId2, title: "What to buy", addedDate: "", order: 0, filter: "all", entityStatus: "idle" },
  ]
})

test("correct todolist should be deleted", () => {
  const endState = todolistsReducer(
    startState,
    deleteTodolist.fulfilled(
      {
        todolist: {},
        todolistId: todolistId1,
      },
      "requestId",
      { todolistId: todolistId1 },
    ),
  )

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be created", () => {
  const title = "New todolist"
  const endState = todolistsReducer(
    startState,
    createTodolist.fulfilled(
      {
        todolist: {
          id: nanoid(),
          addedDate: "",
          title,
          order: 0,
        },
      },
      "requestId",
      { title },
    ),
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(title)
})

test("correct todolist should change its title", () => {
  const title = "New title"
  const endState = todolistsReducer(
    startState,
    changeTodolistTitle.fulfilled({ todolistId: todolistId2, title }, "requestId", {
      todolistId: todolistId2,
      title,
    }),
  )

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(title)
})

test("correct todolist should change its filter", () => {
  const filter = "completed"
  const endState = todolistsReducer(startState, changeTodolistFilter({ id: todolistId2, filter }))

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(filter)
})
