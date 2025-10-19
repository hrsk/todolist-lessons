import "./App.css"
import { Main } from "@/app/Main"
import { Header } from "@/common/components/Header/Header"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectAppStatus, selectThemeMode } from "@/app/app-slice.ts"
import { LinearProgress } from "@mui/material"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const appStatus = useAppSelector(selectAppStatus)

  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        {appStatus === "pending" && <LinearProgress />}
        <Main />
      </div>
    </ThemeProvider>
  )
}
