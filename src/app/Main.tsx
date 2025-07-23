import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { createTodolist } from "@/features/todolists/model/todolists-slice"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { Navigate } from "react-router"
import { Path } from "@/common/routing/Routing.tsx"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"

export const Main = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  const createTodolistHandler = (title: string) => {
    dispatch(createTodolist({ title }))
  }

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
