import type { ButtonHTMLAttributes } from "react"
import styles from "./Button.module.css"

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  text: string
}

export const Button = ({ type = "button", text, className = "", ...rest }: ButtonProps) => {
  return (
    <button className={`${styles.button} ${className}`} type={type} {...rest}>
      {text}
    </button>
  )
}
