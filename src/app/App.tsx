import { Header } from "@/common/components/Header/Header"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectAppStatus, selectThemeMode, setIsLoggedIn } from "@/app/app-slice.ts"
import { CircularProgress, LinearProgress } from "@mui/material"
import { Routing } from "@/common/routing"
import { useEffect } from "react"
import styles from "./App.module.css"
import { useMeQuery } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const appStatus = useAppSelector(selectAppStatus)

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const { data, isLoading } = useMeQuery()

  // const [isAuth, setIsAuth] = useState<boolean>(false)

  useEffect(() => {
    if (isLoading) return
    if (data?.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }))
    }
    // dispatch(authMe())
    //   .unwrap()
    //   .finally(() => {
    //     setIsAuth(true)
    //   })
  }, [isLoading])

  if (isLoading) {
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
