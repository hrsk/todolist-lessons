import styles from "./PageNotFound.module.css"
import Button from "@mui/material/Button"
import { Link } from "react-router"
import { PropsWithChildren } from "react"

export const PageNotFound = () => (
  <>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <Button component={Link} to={"/"}>
      BACK TO HOMEPAGE
    </Button>
    <Button component={CustomLink} href={"/"}>
      BACK TO HOMEPAGE
    </Button>
    <Button href="/" target="_blank" variant="outlined">
      BACK TO HOMEPAGE
    </Button>
    ;
  </>
)

const CustomLink = (props: PropsWithChildren) => <a {...props}>{props.children}</a>
