import {
  changeThemeModeAC,
  selectIsLoading,
  selectIsLoggedIn,
  selectThemeMode,
  setIsLoggedIn,
} from "@/app/app-slice.ts"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import { getTheme } from "@/common/theme"
import { NavButton } from "@/common/components/NavButton/NavButton"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import LinearProgress from "@mui/material/LinearProgress"
import { useLogoutMutation } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/types"
import { AUTH_TOKEN } from "@/common/constants"
import { baseApi } from "@/app/api/baseApi.ts"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const isLoading = useAppSelector(selectIsLoading)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const [logout] = useLogoutMutation()

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  const logoutHandler = () => {
    logout().then((res) => {
      if (res.data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: false }))
        localStorage.removeItem(AUTH_TOKEN)
      }
      // dispatch(baseApi.util.resetApiState())

    }).then(() => {
      dispatch(baseApi.util.invalidateTags(["Tasks", "Todolist"]))
    })
    // dispatch(logout())
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {isLoggedIn && <NavButton onClick={logoutHandler}>Logout</NavButton>}
            {/*<NavButton>Sign up</NavButton>*/}
            <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
            <Switch color={"default"} onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {isLoading === "loading" && <LinearProgress />}
    </AppBar>
  )
}
