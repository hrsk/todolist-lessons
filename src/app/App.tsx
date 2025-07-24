import styles from "./App.module.css"
import { selectThemeMode, setIsLoggedIn } from "@/app/app-slice"
import { Header } from "@/common/components/Header/Header"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorSnackbar } from "@/common/components/ErrorSnackBar/ErrorSnackBar.tsx"
import { Routing } from "@/common/routing"
import { useEffect, useState } from "react"
import { CircularProgress } from "@mui/material"
import { useAuthMeQuery } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/types"

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)

  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const { data, isLoading } = useAuthMeQuery()

  useEffect(() => {
    if (!isLoading) {
      if (data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
      setIsInitialized(true)
    }
    // dispatch(authMe())
    //   .unwrap()
    //   .finally(() => {
    //     setIsInitialized(true)
    //   })
  }, [isLoading])

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
