import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx"
import { useState } from "react"
import { TasksPagination } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  // const dispatch = useAppDispatch()

  const [page, setPage] = useState<number>(1)

  const { data, isLoading, currentData } = useGetTasksQuery({ todolistId: id, params: { page } })

  console.log(data,currentData)
  // console.log('isFetching:', isFetching)
  // console.log('isLoading:', isLoading)

  // if (error) {
  //   dispatch(setAppError({ error: error.data.message }))
  // }

  // useEffect(() => {
  //   if (error) {
  //     if ("status" in error) {
  //       //FetchBaseQueryError
  //       const errMsg = "error" in error ? error.error : JSON.stringify(error.data)
  //       //не безопасно
  //       // const errMsg = "error" in error ? error.error : (error.data as { message: string }).message
  //       dispatch(setAppError({ error: errMsg }))
  //       // dispatch(setAppError({ error: (error as any).data.error }))
  //     } else {
  //       // SerializedError
  //       dispatch(setAppError({ error: error.message || "some error occurred" }))
  //     }
  //   }
  // }, [error])

  // console.log(data)
  // const tasks = useAppSelector(selectTasks)

  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   dispatch(fetchTasks(id))
  // }, [])

  // const todolistTasks = tasks[id]
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
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolistId={id} />)}</List>
      )}
      <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
    </>
  )
}
