import styles from "./PageNotFound.module.css"
import { Link } from "react-router"
import { Button } from "@/common/components/Button/Button.tsx"

export const PageNotFound = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>page not found</h2>
      <Button as={Link} children={"homepage"} to={"/"} />
    </div>
  )
}
