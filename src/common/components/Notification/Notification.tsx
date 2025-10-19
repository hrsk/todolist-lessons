import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { SyntheticEvent, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectAppError, setAppError } from "@/app/app-slice.ts"

type Severity = "success" | "info" | "warning" | "error"
type Variant = "standard" | "filled" | "outlined"

type Props = {
  variant: Variant
  severity: Severity
}

export const Notification = (props: Props) => {
  const { variant, severity } = props

  const dispatch = useAppDispatch()
  const errorText = useAppSelector(selectAppError)

  const [open, setOpen] = useState(true)

  const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
    dispatch(setAppError({ error: null }))
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} variant={variant} sx={{ width: "100%" }}>
        {errorText}
      </Alert>
    </Snackbar>
  )
}
