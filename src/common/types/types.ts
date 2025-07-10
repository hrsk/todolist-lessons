import { z, ZodType } from "zod/v4"
import { domainTaskSchema } from "@/features/todolists/api/tasksApi.types.ts"

// export type FieldError = {
//   error: string
//   field: string
// }

const filedErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})

export type FieldError = z.infer<typeof filedErrorSchema>

// export type BaseResponse<T = {}> = {
//   data: T
//   resultCode: ResultCode
//   messages: string[]
//   fieldsErrors: FieldError[]
// }

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export enum ResultCode {
  Success = 0,
  Error = 1,
  CaptchaError = 10,
}

// export const baseResponseSchema = <T>(data: T) => {
//   return z.object({
//     data: data,
//     resultCode: z.number(),
//     messages: z.array(z.string()),
//     fieldsError: z.union([z.undefined(), z.array(filedErrorSchema)]),
//   })
// }
//
// export type BaseType<T> = ReturnType<typeof baseResponseSchema<T>>

export type BaseResponse<T = {}> = z.infer<ReturnType<typeof baseResponseSchema<ZodType<T>>>>

export const baseResponseSchema = <T extends ZodType>(data: T) => {
  return z.object({
    data,
    resultCode: z.number(),
    messages: z.array(z.string()),
    fieldsError: z.union([z.undefined(), z.array(filedErrorSchema)]),
  })
}

export const taskResponseSchema = baseResponseSchema(
  z.object({
    item: domainTaskSchema,
  }),
)

export const baseResponseWithEmptyObjectData = baseResponseSchema(z.object({}))

export type TaskResponseSchema = z.infer<typeof taskResponseSchema>
