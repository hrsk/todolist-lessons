import { BaseResponse } from "@/common/types"
import { LoginInputs } from "@/features/auth/lib/schemas"
import { baseApi } from "@/app/api/baseApi.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<BaseResponse<{ userId: number; token: string }>, LoginInputs>({
      query: (payload) => ({ method: "post", url: "auth/login", body: payload }),
    }),
    logout: builder.mutation<BaseResponse, void>({
      query: () => ({ method: "delete", url: "auth/login" }),
    }),
    authMe: builder.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me",
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useAuthMeQuery } = authApi

// const _authApi = {
//   login(payload: LoginInputs) {
//     return instance.post<BaseResponse<{ userId: number; token: string }>>("auth/login", payload)
//   },
//   logout() {
//     return instance.delete<BaseResponse>("auth/login")
//   },
//   me() {
//     return instance.get<BaseResponse<{ id: number; email: string; login: string }>>("auth/me")
//   },
// }
