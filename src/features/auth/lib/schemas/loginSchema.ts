import { z } from "zod/v4"

const minLength = 5
const maxLength = 16

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .nonempty()
    .min(minLength, { error: `Password length minimal ${minLength} symbols` })
    .max(maxLength, { error: `Password length maximum ${maxLength} symbols` }),
  // password: z.string().check(z.minLength(5)),
  rememberMe: z.boolean().optional(),
})
