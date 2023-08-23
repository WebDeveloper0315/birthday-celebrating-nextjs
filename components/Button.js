import styles from "./Button.module.css"

export const Button = ({
  type = "button",
  text,
  onClick = null,
  className = "",
}) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
