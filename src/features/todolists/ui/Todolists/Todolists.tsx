import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { fetchTodolists, selectTodolists } from "@/features/todolists/model/todolists-slice"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useEffect } from "react"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"
import { Navigate } from "react-router"
import { Path } from "@/common/routing/Routing.tsx"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTodolists())
  }, [])

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  return (
    <>
      {todolists.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
