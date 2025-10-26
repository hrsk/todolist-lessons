import { Main } from "@/app/Main"
import { Route, Routes } from "react-router"
import { PageNotFound } from "@/common/components"
import { Login } from "@/features/auth"

export const PATHS = {
  Main: "/",
  Login: "/login",
  PageNotFound: "*",
} as const

export const Routing = () => (
  <Routes>
    <Route path={PATHS.Main} element={<Main />} />
    <Route path={PATHS.Login} element={<Login />} />
    <Route path={PATHS.PageNotFound} element={<PageNotFound />} />
  </Routes>
)
