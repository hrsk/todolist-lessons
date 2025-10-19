import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { fetchTasks, selectTasks } from "@/features/todolists/model/tasks-slice"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { useEffect } from "react"
import { TaskStatus } from "@/common/enums"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id: todolistId, filter } = todolist

  const tasks = useAppSelector(selectTasks)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTasks({ todolistId }))
  }, [])

  const todolistTasks = tasks[todolistId]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {filteredTasks && filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks && filteredTasks.map((task) => <TaskItem key={task.id} task={task} todolistId={todolistId} />)}
        </List>
      )}
    </>
  )
}
