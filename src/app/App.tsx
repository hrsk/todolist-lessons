import styles from "./App.module.css"
import { selectThemeMode } from "@/app/app-slice"
import { Header } from "@/common/components/Header/Header"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorSnackbar } from "@/common/components/ErrorSnackBar/ErrorSnackBar.tsx"
import { Routing } from "@/common/routing"
import { useEffect, useState } from "react"
import { authMe } from "@/features/auth/model/auth-slice.ts"
import { CircularProgress } from "@mui/material"

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)

  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authMe()).unwrap().finally(() => {
      setIsInitialized(true)
    })
  }, [])

  if (!isInitialized) {
    return (
      <div className={styles.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
