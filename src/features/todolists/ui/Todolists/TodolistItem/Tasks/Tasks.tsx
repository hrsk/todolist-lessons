import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx"
import { PAGE_SIZE } from "@/common/constants/constants.ts"
import { TasksPagination } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx"
import { useState } from "react"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id: todolistId, filter } = todolist

  const [page, setPage] = useState(1)

  const { data, isLoading, currentData } = useGetTasksQuery({ todolistId, count: PAGE_SIZE, page })

  console.log({ data, currentData })

  const todolistTasks = data?.items
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks && filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>
            {filteredTasks &&
              filteredTasks.map((task) => <TaskItem key={task.id} task={task} todolistId={todolistId} />)}
          </List>
          <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
        </>
      )}
    </>
  )
}
