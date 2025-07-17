import { z } from "zod/v4"

const minLength = 5
const maxLength = 18

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .nonempty({ error: "Password is required" })
    .min(minLength, { error: `Password must be at least ${minLength} characters long.` })
    .max(maxLength, { error: `Password length must not exceed 16 characters.` }),
  // password: z.string().check(z.minLength(5)),
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(),
})

export type LoginInputs = z.infer<typeof loginSchema>
