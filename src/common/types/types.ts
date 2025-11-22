import { z } from "zod/v4"
import { ResultCode } from "@/common/enums"

// export type FieldError = {
//   error: string
//   field: string
// }

export const fieldErrorSchema = z.object({
  error: z.string().nullable(),
  field: z.string().nullable(),
})

export type FieldError = z.infer<typeof fieldErrorSchema>

// export type BaseResponse<T = {}> = {
//   data: T
//   resultCode: number
//   messages: string[]
//   fieldsErrors: FieldError[]
// }

export type RequestStatus = "idle" | "pending" | "succeeded" | "failed"

export type Nullable<T> = T | null

// export type LoginInputs = {
//   email: string
//   password: string
//   rememberMe: boolean
// }

// const baseResponseSchema = function createBaseResponseSchema<T extends z.ZodType>(schema: T): T {
//   return z.object({
//     data: z.array(schema),
//     resultCode: z.number(),
//     messages: z.array(z.string()),
//     fieldsErrors: z.array(fieldErrorSchema),
//   })
// }

export const createBaseResponseSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    data: schema,
    resultCode: z.enum(ResultCode),
    messages: z.string().array(),
    fieldsErrors: z.array(fieldErrorSchema),
  })
}

export type BaseResponse = z.infer<typeof createBaseResponseSchema>

export type FilterValues = 'all' | 'active' | 'completed'