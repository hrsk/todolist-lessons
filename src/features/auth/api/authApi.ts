import { LoginInputs } from "@/features/auth/lib/schemas"
import { authResponse, meResponse } from "@/features/auth/api/authApi.types.ts"
import { baseApi } from "@/app/baseApi.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<authResponse, LoginInputs>({
      query: (payload) => ({
        url: `auth/login`,
        method: "POST",
        body: payload,
      }),
    }),
    logout: build.mutation<authResponse, void>({
      query: () => ({
        url: `auth/login`,
        method: "DELETE",
      }),
    }),
    me: build.query<meResponse, void>({
      query: () => `auth/me`,
    }),
    captcha: build.query<{ url: string }, void>({
      query: () => `security/get-captcha-url`,
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useMeQuery, useCaptchaQuery } = authApi
