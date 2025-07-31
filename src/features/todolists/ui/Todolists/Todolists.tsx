import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi.ts"
import Box from "@mui/material/Box"
import { containerSx } from "@/common/styles"
import { TodolistSkeleton } from "@/features/todolists/ui/Todolists/TodolistSceleton/TodolistSkeleton.tsx"

export const Todolists = () => {
  // const [skip, setSkip] = useState(true)

  const { data: todolists, isLoading } = useGetTodolistsQuery()
  // const { data: todolists } = useGetTodolistsQuery(undefined, { skip })

  // const [trigger, {data: todolists}]= useLazyGetTodolistsQuery()

  // const getTodolistsLazy = () => {
  //   trigger()
  // }

  // const getTodolistsSkip = () => {
  //   setSkip(false)
  // }

    if (isLoading) {
      return (
        <Box sx={containerSx} style={{ gap: "32px" }}>
          {Array(3)
            .fill(null)
            .map((_, id) => (
              <TodolistSkeleton key={id} />
            ))}
        </Box>
      )
    }

  return (
    <>
      {/*<button onClick={getTodolistsLazy}>get</button>*/}
      {/*<button onClick={getTodolistsSkip}>get</button>*/}
      {todolists?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
