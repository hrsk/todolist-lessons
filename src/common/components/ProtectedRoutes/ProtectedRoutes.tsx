import { ReactNode } from "react"
import { Navigate, Outlet } from "react-router"
import { PATHS } from "@/common/routing"

type Props = {
  children?: ReactNode
  isAllowed: boolean
  redirectTo?: string
}

export const ProtectedRoutes = (props: Props) => {
  const { isAllowed, children, redirectTo = PATHS.Login } = props

  if (!isAllowed) {
    return <Navigate to={redirectTo} />
  }

  return children ? children : <Outlet />
}
