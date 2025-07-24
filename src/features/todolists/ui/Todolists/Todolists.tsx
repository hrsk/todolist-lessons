import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi.ts"

export const Todolists = () => {
  // const [skip, setSkip] = useState(true)

  const { data: todolists } = useGetTodolistsQuery()
  // const { data: todolists } = useGetTodolistsQuery(undefined, { skip })

  // const [trigger, {data: todolists}]= useLazyGetTodolistsQuery()

  // const getTodolistsLazy = () => {
  //   trigger()
  // }

  // const getTodolistsSkip = () => {
  //   setSkip(false)
  // }

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
