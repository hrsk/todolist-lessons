import { setAppRequestStatus, setAppError } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { BaseResponse } from "@/common/types"

export const handleAppError = <T>(data: BaseResponse<T>, dispatch: Dispatch) => {
  const error = data.messages.length ? data.messages[0] : "Some error occurred"

  dispatch(setAppError({ error }))
  dispatch(setAppRequestStatus({ isLoading: "failed" }))
}
