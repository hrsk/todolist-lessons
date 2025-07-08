import { changeAppRequestStatus, setAppError } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"

export const handleServerError = (error: any, dispatch: Dispatch) => {
  let errorMessage

  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.message
  } else if (error instanceof Error) {
    errorMessage = `Native error: ${error.message}`
  } else {
    errorMessage = JSON.stringify(error)
  }

  dispatch(setAppError({ error: errorMessage }))
  dispatch(changeAppRequestStatus({ isLoading: "failed" }))
}
