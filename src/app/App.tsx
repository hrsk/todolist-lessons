import { Header } from "@/common/components/Header/Header"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectAppStatus, selectThemeMode } from "@/app/app-slice.ts"
import { CircularProgress, LinearProgress } from "@mui/material"
import { Routing } from "@/common/routing"
import { useEffect, useState } from "react"
import { authMe } from "@/features/auth/model/auth-slice.ts"
import styles from "./App.module.css"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const appStatus = useAppSelector(selectAppStatus)

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const [isAuth, setIsAuth] = useState<boolean>(false)

  useEffect(() => {
    dispatch(authMe())
      .unwrap()
      .finally(() => {
        setIsAuth(true)
      })
  }, [])

  if (!isAuth) {
    return (
      <div className={styles.circularProgress}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        {appStatus === "pending" && <LinearProgress />}
        <Routing />
      </div>
    </ThemeProvider>
  )
}
