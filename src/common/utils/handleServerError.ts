import { setAppRequestStatus, setAppError } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"
import { z } from "zod/v4"

export const handleServerError = (error: any, dispatch: Dispatch) => {
  let errorMessage

  switch (true) {
    case axios.isAxiosError(error):
      errorMessage = error.response?.data?.message || error.message
      break

    case error instanceof z.ZodError:
      console.table(error.issues)
      errorMessage = "Zod error. Смотри консоль"
      break

    case error instanceof Error:
      errorMessage = `Native error: ${error.message}`
      break

    default:
      errorMessage = JSON.stringify(error)
  }

  dispatch(setAppError({ error: errorMessage }))
  dispatch(setAppRequestStatus({ isLoading: "failed" }))

  // let errorMessage
  //
  // if (axios.isAxiosError(error)) {
  //   errorMessage = error.response?.data?.message || error.message
  // } else if (error instanceof Error) {
  //   errorMessage = `Native error: ${error.message}`
  // } else {
  //   errorMessage = JSON.stringify(error)
  // }
  //
  // dispatch(setAppError({ error: errorMessage }))
  // dispatch(changeAppRequestStatus({ isLoading: "failed" }))
}
