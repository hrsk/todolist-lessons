import { setAppError, setAppStatus } from "@/app/app-slice"
import type { BaseResponse } from "@/common/types"
import type { Dispatch } from "@reduxjs/toolkit"

export const handleServerAppError = <T>(data: BaseResponse<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }))
  } else {
    dispatch(setAppError({ error: "Some error occurred" }))
  }
  dispatch(setAppStatus({ status: "failed" }))
}
