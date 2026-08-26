"use client"

import { useEffect, useRef, useState } from "react"
import style from "./CopyLinkButton.module.css"
import { Button } from "./Button"

const FEEDBACK_MS = 2000

/**
 * Copies the current URL and shows a confirmation for two seconds.
 *
 * The old version ran a 1s interval and used a `timer` state whose updater
 * could return `undefined`, leaving the countdown permanently unset. A single
 * timeout says the same thing without the arithmetic.
 */
export const CopyLinkButton = () => {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const flash = (ok: boolean) => {
    setCopied(ok)
    setFailed(!ok)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setCopied(false)
      setFailed(false)
    }, FEEDBACK_MS)
  }

  const handleClick = async () => {
    try {
      // navigator.clipboard is undefined on insecure origins and in old browsers.
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable")
      await navigator.clipboard.writeText(window.location.href)
      flash(true)
    } catch {
      flash(false)
    }
  }

  const text = copied ? "Link copied!" : failed ? "Copy failed — press Ctrl+C" : "Copy Link"

  return (
    <Button
      text={text}
      onClick={handleClick}
      aria-live="polite"
      className={copied ? style.active : failed ? style.failed : style.inactive}
    />
  )
}
