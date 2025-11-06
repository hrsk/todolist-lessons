import { LoginInputs } from "@/features/auth/lib/schemas"
import { instance } from "@/common/instance"
import { authResponse } from "@/features/auth/api/authApi.types.ts"

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post<authResponse>("auth/login", payload)
  },
  logout() {
    return instance.delete<authResponse>("auth/login")
  },
}