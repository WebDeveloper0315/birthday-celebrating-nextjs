"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import styles from "./Home.module.css"
import useTheme from "@/hooks/useTheme"
import { Button } from "@/components"

export default function Home() {
  const { themes, setTheme, currentTheme } = useTheme()
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = value.trim()
    if (!name) {
      // An inline message rather than `alert()`, which blocks the page and
      // cannot be styled, read out politely, or dismissed with the keyboard.
      setError("Please enter a name.")
      return
    }

    setError(null)
    // Names contain spaces, slashes, question marks and emoji. Encoding them is
    // what stops "Jhon Smith" arriving on the next page as "Jhon%20Smith".
    const path = `/${encodeURIComponent(name)}`
    router.push(currentTheme.id === 0 ? path : `${path}?color=${currentTheme.id}`)
  }

  return (
    <main className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.span}>Welcome</span> to this page!
        </h1>

        <h2 className={styles.title}>
          Create a <span className={styles.span}>Birthday</span> Wish
        </h2>
      </div>

      <div className={styles.themeWrapper}>
        <fieldset className={styles.theme}>
          <legend className={styles.srOnly}>Theme colour</legend>
          {themes.map((theme) => (
            <input
              key={theme.id}
              type="radio"
              className={theme.name}
              id={`theme-${theme.id}`}
              name="theme"
              value={theme.id}
              aria-label={`${theme.name} theme`}
              checked={currentTheme.id === theme.id}
              onChange={() => setTheme(theme.id)}
            />
          ))}
        </fieldset>
      </div>

      <div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            id="input"
            name="go"
            className={styles.input}
            placeholder="Enter your name"
            value={value}
            autoComplete="off"
            aria-label="Name to wish"
            aria-invalid={error !== null}
            onChange={(event) => {
              setValue(event.target.value)
              if (error) setError(null)
            }}
          />
          <Button className={styles.button} type="submit" text="Go!" />
        </form>

        <p className={styles.error} role="status">
          {error}
        </p>

        <p className={`${styles.desc} ${styles.mb3}`}>
          Created by{" "}
          <a
            className={styles.span}
            href="https://github.com/WebDeveloper0315"
            target="_blank"
            rel="noreferrer"
          >
            Blackghost
          </a>
          .
        </p>
      </div>
    </main>
  )
}
