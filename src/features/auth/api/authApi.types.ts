import { createBaseResponseSchema } from "@/common/types"
import { z } from "zod/v4"

export const authResponseSchema = createBaseResponseSchema(
  z.object({ userId: z.number().nonnegative(), token: z.string() }),
)

export type authResponse = z.infer<typeof authResponseSchema>
