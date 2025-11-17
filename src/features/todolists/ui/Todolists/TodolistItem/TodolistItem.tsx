import { FilterButtons } from "./FilterButtons/FilterButtons"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useCreateTaskMutation } from "@/features/todolists/api/tasksApi.ts"
import { RequestStatus } from "@/common/types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { useAppDispatch } from "@/common/hooks"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const [createTask] = useCreateTaskMutation()

  const dispatch = useAppDispatch()

  const changeRequestStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodos", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === todolist.id)
        if (todolist) {
          todolist.entityStatus = entityStatus
        }
      }),
    )
  }

  const createTaskHandler = (title: string) => {
    changeRequestStatus("pending")
    createTask({ todolistId: todolist.id, title })
      .unwrap()
      .then(() => changeRequestStatus("succeeded"))
      .catch(() => changeRequestStatus("failed"))
      .finally(() => changeRequestStatus("idle"))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTaskHandler} isDisabled={todolist.entityStatus === 'pending'} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
}
