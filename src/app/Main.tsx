import { useAppSelector } from "@/common/hooks"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { Notification } from "@/common/components"
import { selectAppError, selectIsLoggedIn } from "@/app/app-slice.ts"
import { Navigate } from "react-router"
import { PATHS } from "@/common/routing"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistsApi.ts"

export const Main = () => {

  const isError = useAppSelector(selectAppError)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const [createTodolist] = useAddTodolistMutation()

  const createTodolistHandler = (title: string) => {
    createTodolist(title)
  }

  if (!isLoggedIn) {
    return <Navigate to={PATHS.Login} />
  }

  return (
    <Container maxWidth={"lg"}>
      {isError && <Notification severity={"error"} variant={"standard"} />}
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
