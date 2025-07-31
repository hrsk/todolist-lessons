import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import { getListItemSx } from "./TaskItem.styles"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"
import { ChangeEvent } from "react"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi.ts"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = ({ task, todolistId }: Props) => {
  // const dispatch = useAppDispatch()

  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const deleteTaskHandler = () => {
    deleteTask({ todolistId, taskId: task.id })
    // dispatch(deleteTask({ todolistId, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    // const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    updateTask({
      todolistId: task.todoListId,
      taskId: task.id,
      model: { ...task, status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New },
    })

    // dispatch(
    //   updateTask({
    //     todolistId: task.todoListId,
    //     taskId: task.id,
    //     updateTaskModel: { ...task, status: newStatusValue },
    //   }),
    // )
  }

  const changeTaskTitle = (title: string) => {
    updateTask({ todolistId: task.todoListId, taskId: task.id, model: { ...task, title } })
    // dispatch(updateTask({ todolistId: task.todoListId, taskId: task.id, updateTaskModel: { ...task, title } }))
  }

  return (
    <ListItem sx={getListItemSx(task.status === TaskStatus.Completed)}>
      <div>
        <Checkbox checked={task.status === TaskStatus.Completed} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTaskHandler}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
