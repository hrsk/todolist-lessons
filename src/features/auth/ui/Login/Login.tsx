import { selectIsLoggedIn, selectThemeMode, setCaptcha, setIsLoggedIn } from "@/app/app-slice"
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
import { LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { Navigate } from "react-router"
import { PATHS } from "@/common/routing"
import { AUTH_TOKEN, EMAIL } from "@/common/constants"
import { useCaptchaQuery, useLoginMutation } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"
import { useState } from "react"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const [skip, setSkip] = useState<boolean>(true)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: EMAIL, password: "", rememberMe: false, captcha: "" },
  })

  const [login] = useLoginMutation()
  const { data: captchaUrl } = useCaptchaQuery(undefined, { skip })

  const onSubmit: SubmitHandler<LoginInputs> = (data: LoginInputs) => {
    login(data).then((res) => {
      if (res.data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
        localStorage.setItem(AUTH_TOKEN, res.data.data.token)
        reset()
      } else {
        if (res.data?.resultCode === ResultCode.CaptchaError) {
          setSkip(false)
          if (captchaUrl) {
            dispatch(setCaptcha({ captchaUrl: captchaUrl.url }))
          }
        }
      }
    })
    // .unwrap()
    // .then(() => {
    //   navigate(PATHS.Main)
    // })
    // reset()
  }

  if (isLoggedIn) {
    return <Navigate to={PATHS.Main} />
  }
  // useEffect(() => {
  //   navigate(PATHS.Main)
  // }, [isLoggedIn])

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
            <FormControlLabel
              label={"Email"}
              control={
                <Controller
                  name={"email"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      placeholder={"Email"}
                      onChange={onChange}
                      value={value}
                      margin={"normal"}
                      error={!!errors.email}
                    />
                  )}
                />
              }
              {...register("email")}
            />

            {/*<TextField*/}
            {/*  label="Email"*/}
            {/*  margin="normal"*/}
            {/*  error={!!errors.email}*/}
            {/*  {...register("email")}*/}
            {/*/>*/}
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
            <FormControlLabel
              label={"Password"}
              control={
                <Controller
                  name={"password"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      type={"password"}
                      placeholder={"Password"}
                      onChange={onChange}
                      value={value}
                      margin={"normal"}
                      error={!!errors.password}
                    />
                  )}
                />
              }
              {...register("password")}
            />
            {/*<TextField type="password" label="Password" margin="normal" {...register("password")} />*/}
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}

            <FormControlLabel
              label="remember me"
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox onChange={(e) => onChange(e.target.checked)} checked={value} />
                  )}
                  // render={({ field: { value, ...rest } }) => <Checkbox {...rest} checked={value} />}
                />
              }
              {...register("rememberMe")}
            />
            {captchaUrl && (
              <>
                <FormControlLabel
                  label={"Captcha"}
                  control={
                    <Controller
                      name={"captcha"}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          placeholder={"Please enter anti-bot symbols"}
                          onChange={onChange}
                          value={value}
                          margin={"normal"}
                          error={!!errors.email}
                        />
                      )}
                    />
                  }
                  {...register("captcha")}
                />
                <img src={captchaUrl.url} alt="captcha symbols" />
              </>
            )}
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
