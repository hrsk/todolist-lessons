import { Main } from "@/app/Main"
import { Route, Routes } from "react-router"
import { Login } from "@/features/todolists/ui/Login/Login.tsx"
import { PageNotFound } from "../components"
import { ProtectedRoute } from "@/common/routing/ProtectedRoute.tsx"
import { useAppSelector } from "../hooks"
import { selectIsLoggedIn } from "@/app/app-slice.ts"

export const Path = {
  Main: "/",
  Login: "/login",
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
      </Route>
      {/*<Route*/}
      {/*  path={Path.Main}*/}
      {/*  element={*/}
      {/*    <PrivateRoutes isAllowed={isLoggedIn}>*/}
      {/*      <Main />*/}
      {/*    </PrivateRoutes>*/}
      {/*  }*/}
      {/*/>*/}
      <Route element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath={Path.Main} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>
      {/*<Route*/}
      {/*  path={Path.Login}*/}
      {/*  element={*/}
      {/*    <ProtectedRoute redirectPath={Path.Main} isAllowed={!isLoggedIn}>*/}
      {/*      <Login />*/}
      {/*    </ProtectedRoute>*/}
      {/*  }*/}
      {/*/>*/}

      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
