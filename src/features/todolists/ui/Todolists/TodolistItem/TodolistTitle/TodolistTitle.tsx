import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import { useRemoveTodolistMutation, useUpdateTodolistMutation } from "@/features/todolists/api/todolistsApi.ts"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id: todolistId, title } = todolist

  const [removeTodolist] = useRemoveTodolistMutation()
  const [updateTodolistTitle] = useUpdateTodolistMutation()

  const removeTodolistHandler = () => {
    removeTodolist(todolistId)
  }

  const changeTodolistTitleHandler = (title: string) => {
    updateTodolistTitle({ todolistId, title })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
      </h3>
      <IconButton onClick={removeTodolistHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
