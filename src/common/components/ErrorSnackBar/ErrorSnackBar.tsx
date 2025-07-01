import { SyntheticEvent } from "react"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { useSelector } from "react-redux"
import { selectAppError, setAppError } from "@/app/app-slice.ts"
import { useAppDispatch } from "@/common/hooks"

export const ErrorSnackbar = () => {
  const isError = useSelector(selectAppError)

  const dispatch = useAppDispatch()

  const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }

    dispatch(setAppError({ error: null }))
  }

  return (
    <Snackbar open={!!isError} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
        {isError}
      </Alert>
    </Snackbar>
  )
}
