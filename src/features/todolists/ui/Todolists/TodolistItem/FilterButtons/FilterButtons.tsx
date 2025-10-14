import { useAppDispatch } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import { changeTodolistFilter, type FilterValues } from "@/features/todolists/model/todolists-slice"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi.types.ts"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id: todolistId, filter } = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(changeTodolistFilter({ todolistId, filter }))
  }

  return (
    <Box sx={containerSx}>
      <Button variant={filter === "all" ? "outlined" : "text"} color={"inherit"} onClick={() => changeFilter("all")}>
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={() => changeFilter("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={() => changeFilter("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}
