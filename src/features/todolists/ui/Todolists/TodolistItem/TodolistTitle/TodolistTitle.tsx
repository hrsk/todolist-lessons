import { EditableSpan } from "@/common/components"
import { type DomainTodolist } from "@/features/todolists/model/todolists-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {
  todolistsApi,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation,
} from "@/features/todolists/api/todolistsApi.ts"
import { useAppDispatch } from "@/common/hooks"
import { RequestStatus } from "@/common/types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id: todolistId, title } = todolist

  const dispatch = useAppDispatch()

  const [deleteTodolist] = useDeleteTodolistMutation()
  const [changeTodolistTitle] = useChangeTodolistTitleMutation()

  const changeTodolistStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === todolistId)
        if (todolist) {
          todolist.entityStatus = entityStatus
        }
      }),
    )
  }

  const deleteTodolistHandler = () => {
    changeTodolistStatus("loading")
    deleteTodolist(todolistId)
      .unwrap()
      .catch(() => changeTodolistStatus("failed"))
    // dispatch(deleteTodolist({ todolistId: id }))
  }

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ todolistId, title })
    // dispatch(changeTodolistTitle({ todolistId: id, title }))
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
      </h3>
      <IconButton onClick={deleteTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
