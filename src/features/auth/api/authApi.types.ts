import { createBaseResponseSchema } from "@/common/types"
import { z } from "zod/v4"

export const authResponseSchema = createBaseResponseSchema(
  z.object({ userId: z.number().nonnegative(), token: z.string() }),
)

export type authResponse = z.infer<typeof authResponseSchema>

export const meResponseSchema = createBaseResponseSchema(
  z.object({
    id: z.number().nonnegative(),
    email: z.string(),
    login: z.string(),
  }),
)

export type meResponse = z.infer<typeof meResponseSchema>
