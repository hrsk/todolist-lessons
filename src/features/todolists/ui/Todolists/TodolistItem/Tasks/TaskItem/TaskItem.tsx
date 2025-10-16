import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { useAppDispatch } from "@/common/hooks"
import { removeTask, updateTask } from "@/features/todolists/model/tasks-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { TaskStatus } from "@/common/enums"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = ({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(removeTask({ todolistId, taskId: task.id }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateTask({
        todolistId,
        taskId: task.id,
        updateModel: { ...task, status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New },
      }),
    )
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(updateTask({ todolistId, taskId: task.id, updateModel: { ...task, title } }))
    // dispatch(changeTaskTitle({ todolistId, taskId: task.id, title }))
  }

  const isCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isCompleted)}>
      <div>
        <Checkbox checked={isCompleted} onChange={changeTaskStatusHandler} />
        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
