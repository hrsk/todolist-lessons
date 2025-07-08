import "./App.css"
import { selectThemeMode } from "@/app/app-slice"
import { Main } from "@/app/Main"
import { Header } from "@/common/components/Header/Header"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorSnackbar } from "@/common/components/ErrorSnackBar/ErrorSnackBar.tsx"
import { Routing } from "@/common/routing"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Routing />
        <Main />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
