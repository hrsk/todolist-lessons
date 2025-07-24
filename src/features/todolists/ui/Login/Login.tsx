import { selectThemeMode, setIsLoggedIn } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/features/auth/lib/schemas"
import { useLoginMutation } from "@/features/auth/api/authApi.ts"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/types"

type LoginInputs = {
  email: string
  password: string
  rememberMe?: boolean
}

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const [login] = useLoginMutation()

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const {
    register,
    handleSubmit,
    // reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    login(data).then((res) => {
      if (res.data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
        localStorage.setItem(AUTH_TOKEN, res.data.data.token)
      }
      // reset()
    })
    // dispatch(login(data))
    // reset()
  }

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://social-network.samuraijs.com"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <FormGroup>
            <TextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}

            <TextField
              type="password"
              label="Password"
              error={!!errors.password}
              margin="normal"
              {...register("password")}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}

            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  // render={({ field: { onChange, value } }) => (
                  //   <Checkbox onChange={(e) => onChange(e.target.checked)} checked={value} />
                  // )}
                  render={({ field: { value, ...rest } }) => <Checkbox checked={value} {...rest} />}
                />
              }
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
