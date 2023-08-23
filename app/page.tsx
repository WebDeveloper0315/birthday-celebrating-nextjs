'use client'
import styles from "./Home.module.css"
import { useRouter } from 'next/navigation'
import useTheme from "../hooks/useTheme"
import { useState } from "react"
import { Button } from "../components"

export default function Home() {
  const { themes, setTheme, currentTheme } = useTheme()
  const [value, setValue] = useState("")
  const Router = useRouter()

  const handleInput = (e: any) => {
    e.preventDefault()
    const id = currentTheme.id

    if (!value || value[0] === " ") {
      alert("Please enter a name!")
      return
    }
    if (id == 0) Router.push(value)
    else Router.push(`/${value}?color=${id}`)
  }

  return (
    <main className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>
          Create a <span className={styles.span}>Birthday</span> Wish
        </h1>
      </div>

      <div className={styles.themeWrapper}>
        <form
          className={styles.theme}
          id="theme-input"
          onChange={(e) => setTheme((e.target as HTMLElement).id)}
        >
          {themes.map((item) => (
            <input
              key={item.id.toString()}
              type="radio"
              className={item.name}
              id={item.id.toString()}
              name="theme"
              value={item.color}
              defaultChecked={currentTheme.id === item.id}
            />
          ))}
        </form>
        
      </div>
      
      <div>
        <form className={styles.form} onSubmit={handleInput}>
          <input
            id="input"
            name="go"
            className={styles.input}
            placeholder="Enter your name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button className={styles.button} type="submit" text="Go!" />
        </form>
        <p className={`${styles['desc']} ${styles['mb-3']}`}>
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

