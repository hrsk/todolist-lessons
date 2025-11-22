import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {
  todolistsApi,
  useRemoveTodolistMutation,
  useUpdateTodolistMutation,
} from "@/features/todolists/api/todolistsApi.ts"
import { useAppDispatch } from "@/common/hooks"
import { RequestStatus } from "@/common/types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id: todolistId, title } = todolist

  const dispatch = useAppDispatch()

  const [removeTodolist] = useRemoveTodolistMutation()
  const [updateTodolistTitle] = useUpdateTodolistMutation()

  const changeRequestStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodos", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === todolistId)
        if (todolist) {
          todolist.entityStatus = entityStatus
        }
      }),
    )
  }

  const removeTodolistHandler = async () => {
    changeRequestStatus("pending")
    removeTodolist(todolistId)
      .unwrap()
      .then(() => changeRequestStatus("succeeded"))
      .catch(() => changeRequestStatus("failed"))
      .finally(() => changeRequestStatus("idle"))
    // const patchResult = dispatch(
    //   todolistsApi.util.updateQueryData("getTodos", undefined, state => {
    //     const index = state.findIndex(todolist => todolist.id === todolistId)
    //     if (index !== -1) {
    //       state.splice(index, 1)
    //     }
    //   })
    // )
    // try {
    //   await removeTodolist(todolistId).unwrap()
    // } catch {
    //   patchResult.undo()
    // }
  }

  const changeTodolistTitleHandler = (title: string) => {
    updateTodolistTitle({ todolistId, title })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
      </h3>
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "pending"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
