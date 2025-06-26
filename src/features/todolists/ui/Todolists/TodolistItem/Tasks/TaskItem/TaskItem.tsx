import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { useAppDispatch } from "@/common/hooks"
import { changeTask, changeTaskStatusModelThunk, deleteTaskTC } from "@/features/todolists/model/tasks-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import { getListItemSx } from "./TaskItem.styles"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"
import { ChangeEvent } from "react"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = ({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    // dispatch(deleteTaskAC({ todolistId, taskId: task.id }))
    dispatch(deleteTaskTC({ todolistId, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    // dispatch(changeTaskStatusAC({ todolistId, taskId: task.id, isDone: newStatusValue }))
    dispatch(
      changeTask({
        todolistId: task.todoListId,
        taskId: task.id,
        updateTaskModel: { ...task, status: newStatusValue },
      }),
    )
  }

  // const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
  //   const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
  //   dispatch(changeTaskStatusThunk({ todolistId: task.todoListId, taskId: task.id, status: newStatusValue }))
  // }

  const changeTaskStatusWithModel = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    // const model: UpdateTaskModel = {
    //   title: task.title,
    //   status: newStatusValue,
    //   priority: task.priority,
    //   startDate: task.startDate,
    //   description: task.description,
    //   deadline: task.deadline,
    // }
    // dispatch(changeTaskStatusModelThunk({ todolistId: task.todoListId, taskId: task.id, model }))
    dispatch(changeTaskStatusModelThunk({ ...task, status: newStatusValue }))
  }

  const changeTaskTitle = (title: string) => {
    // dispatch(changeTaskTitleAC({ todolistId, taskId: task.id, title }))
    // dispatch(changeTaskTitleTC({ ...task, title }))
    dispatch(changeTask({ todolistId: task.todoListId, taskId: task.id, updateTaskModel: { ...task, title } }))
  }

  return (
    <ListItem sx={getListItemSx(task.status === TaskStatus.Completed)}>
      <div>
        <Checkbox checked={task.status === TaskStatus.Completed} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
