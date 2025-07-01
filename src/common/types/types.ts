export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T = {}> = {
  data: T
  resultCode: ResultCode
  messages: string[]
  fieldsErrors: FieldError[]
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export enum ResultCode {
  Success = 0,
  Error = 1,
  CaptchaError = 10,
}
