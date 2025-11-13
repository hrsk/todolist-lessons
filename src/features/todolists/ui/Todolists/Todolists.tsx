import { TodolistItem } from "./TodolistItem/TodolistItem"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useGetTodosQuery } from "@/features/todolists/api/todolistsApi.ts"
import styles from "@/app/App.module.css"
import { CircularProgress } from "@mui/material"

export const Todolists = () => {
  const { data: todolists, isFetching } = useGetTodosQuery()

  if (isFetching) {
    return (
      <div className={styles.circularProgress}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <>
      {todolists &&
        todolists.map((todolist) => (
          <Grid key={todolist.id}>
            <Paper sx={{ p: "0 20px 20px 20px" }}>
              <TodolistItem todolist={todolist} />
            </Paper>
          </Grid>
        ))}
    </>
  )
}
