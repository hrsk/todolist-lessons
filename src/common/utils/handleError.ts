import { isErrorWithMessage } from "@/common/utils/isErrorWithMessage.ts"
import { setAppError } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/types"
import { BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query"

export const handleError = (
  api: BaseQueryApi,
  response: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
) => {

  let error = "Some error occurred"

  if (response.error) {
    switch (response.error.status) {
      case "FETCH_ERROR":
      case "PARSING_ERROR":
      case "CUSTOM_ERROR": {
        error = response.error.error
        break
      }
      case 403: {
        error = "403 Forbidden Error. Check API-KEY"
        break
      }
      case 400:
      case 500:
      {
        if (isErrorWithMessage(response.error.data)) {
          error = response.error.data.message
        } else {
          error = JSON.stringify(response.error.data)
        }
      }
        break
      default: {
        error = JSON.stringify(response.error)
        break
      }
    }
    api.dispatch(setAppError({ error }))
  }

  //result code errors
  if ((response.data as { resultCode: ResultCode }).resultCode === ResultCode.Error) {
    const messages = (response.data as { messages: string[] }).messages
    error = messages.length ? messages[0] : error
    api.dispatch(setAppError({ error }))
  }

}