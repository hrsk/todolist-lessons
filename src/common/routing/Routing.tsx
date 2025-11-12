import { Main } from "@/app/Main"
import { Route, Routes } from "react-router"
import { PageNotFound } from "@/common/components"
import { Login } from "@/features/auth"
import { ProtectedRoutes } from "@/common/components/ProtectedRoutes/ProtectedRoutes.tsx"
import { useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/app/app-slice.ts"

export const PATHS = {
  Main: "/",
  Login: "/login",
  PageNotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route element={<ProtectedRoutes isAllowed={isLoggedIn} />}>
        <Route path={PATHS.Main} element={<Main />} />
      </Route>

      <Route element={<ProtectedRoutes isAllowed={!isLoggedIn} redirectTo={PATHS.Main} />}>
        <Route path={PATHS.Login} element={<Login />} />
      </Route>

      <Route path={PATHS.PageNotFound} element={<PageNotFound />} />
    </Routes>
  )
}
