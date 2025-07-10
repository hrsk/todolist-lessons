import { ComponentProps, ElementType, ReactNode } from "react"
import styles from "./Button.module.css"

export const ButtonDefaultAsType = "button" as const
export type ButtonDefaultAsType = typeof ButtonDefaultAsType

export type ButtonOwnProps<E extends ElementType> = {
  children: ReactNode
  as?: E
  className?: string | undefined
}

export type ButtonProps<E extends ElementType> = ButtonOwnProps<E> & Omit<ComponentProps<E>, keyof ButtonOwnProps<E>>

export const Button = <E extends ElementType = ButtonDefaultAsType>({
  children,
  as,
  className,
  ...otherProps
}: ButtonProps<E>) => {
  const Tag = as || ButtonDefaultAsType

  return (
    <Tag className={className ? [className, styles.button].join(" ") : styles.button} {...otherProps}>
      {children}
    </Tag>
  )
}
