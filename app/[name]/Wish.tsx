"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import * as htmlToImage from "html-to-image"
import { saveAs } from "file-saver"
import JSConfetti from "js-confetti"

import styles from "./Name.module.css"
import { Button, CopyLinkButton } from "@/components"
import useTheme from "@/hooks/useTheme"
import messages from "@/utils/birthdayWishes"
import { CONFETTI_BURST, CONFETTI_SETS } from "@/utils/confettiSets"
import { pickFor, randomItem } from "@/utils/random"

const GREETING = "Happy Birthday"
const CONFETTI_INTERVAL_MS = 5000
/** Fallback fill for the export, in case confetti.png fails to load. Matches `.card`. */
const CARD_BACKGROUND = "#ffffff"

type WishProps = {
  name: string
  themeId: string | null
}

type DownloadState = "idle" | "working" | "error"

/**
 * The greeting, one `<span>` per character so each can be animated on a delay.
 *
 * `Array.from` rather than `charAt` so astral characters (emoji, many scripts)
 * survive as single glyphs instead of splitting into broken surrogate halves.
 * The split point comes from `GREETING.length`; it used to be the literal 15,
 * which happened to be correct only for that exact string.
 */
function AnimatedTitle({ name, className }: { name: string; className: string }) {
  const greeting = Array.from(`${GREETING} `)
  const person = Array.from(`${name}!`)
  const total = greeting.length + person.length

  const letter = (char: string, order: number) => (
    <span key={order} style={{ "--order": order + 1 } as CSSProperties}>
      {char}
    </span>
  )

  return (
    <h1
      className={className}
      style={{ "--wishLength": total } as CSSProperties}
      // Per-letter spans read as gibberish in a screen reader, so expose the
      // whole phrase once and hide the decoration.
      aria-label={`${GREETING} ${name}!`}
    >
      <span className={styles.line} aria-hidden="true">
        {greeting.map((char, i) => letter(char, i))}
      </span>
      <span className={styles.line} aria-hidden="true">
        {person.map((char, i) => letter(char, greeting.length + i))}
      </span>
    </h1>
  )
}

/** Turn a name into something safe to put in a download filename. */
function toFileSlug(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || "friend"
}

export default function Wish({ name, themeId }: WishProps) {
  const router = useRouter()
  useTheme(themeId)

  // Chosen from the name, not at random: the server and the client agree (no
  // hydration mismatch), everyone opening the shared link sees the same wish,
  // and the downloaded PNG matches what is on screen. Previously this was
  // `messages[random()]` evaluated inline in JSX, so it changed on every
  // re-render — including every five seconds, when the confetti timer fired.
  const wish = useMemo(() => pickFor(messages, name), [name])

  const cardRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [downloadState, setDownloadState] = useState<DownloadState>("idle")
  const [musicPlaying, setMusicPlaying] = useState(false)

  // Confetti: one burst on arrival, then one every five seconds.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const jsConfetti = new JSConfetti()
    let cancelled = false

    const burst = () => {
      void jsConfetti
        .addConfetti({ ...CONFETTI_BURST, emojis: [...randomItem(CONFETTI_SETS)] })
        .then(() => {
          if (!cancelled) jsConfetti.clearCanvas()
        })
    }

    burst()
    const id = setInterval(burst, CONFETTI_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(id)
      jsConfetti.destroyCanvas()
    }
  }, [])

  // Browsers refuse autoplay until the page has been interacted with, and the
  // rejected promise used to surface as an unhandled error. Try once; if we are
  // turned down, the toggle button below is the way in.
  useEffect(() => {
    audioRef.current?.play().catch(() => {
      /* autoplay blocked — the user can start it from the button */
    })
  }, [])

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setMusicPlaying(false)
      }
    } else {
      audio.pause()
    }
  }, [])

  /**
   * Screenshot the off-screen card. The old version flipped a `downloading`
   * flag, re-rendered the whole page into a capture layout, and then called
   * `downloadImage()` from inside the returned JSX — a side effect plus a
   * `setState` during render, fired from two places and guarded by one boolean.
   * The card now simply always exists, parked off-screen.
   */
  const handleDownload = useCallback(async () => {
    const node = cardRef.current
    if (!node || downloadState === "working") return

    setDownloadState("working")
    try {
      // `toBlob`, not `toPng`. Handed a data-URL *string*, file-saver decides it
      // is a remote link, fails its CORS probe, and falls back to opening the
      // URL in a new tab — the file lands as "downloads.html" and the download
      // is cancelled. The Blob path uses a real `<a download>` and honours the
      // filename.
      const blob = await htmlToImage.toBlob(node, {
        pixelRatio: 2,
        cacheBust: true,
        // Guarantees an opaque backdrop even if the confetti image fails to
        // load, rather than exporting a transparent PNG.
        backgroundColor: CARD_BACKGROUND,
      })
      if (!blob) throw new Error("Could not render the card")
      saveAs(blob, `happy-birthday-${toFileSlug(name)}.png`)
      setDownloadState("idle")
    } catch {
      setDownloadState("error")
    }
  }, [downloadState, name])

  const downloadText =
    downloadState === "working"
      ? "Rendering…"
      : downloadState === "error"
        ? "Download failed — retry"
        : "Download as Image"

  return (
    <div className={styles.container}>
      <main className={styles.animate}>
        <div className={styles.main}>
          <AnimatedTitle name={name} className={styles.title} />
        </div>
        <p className={styles.desc}>{wish}</p>

        <div className={styles.buttonContainer}>
          <CopyLinkButton />
          <Button onClick={handleDownload} text={downloadText} disabled={downloadState === "working"} />
          <Button
            onClick={toggleMusic}
            text={musicPlaying ? "Pause music" : "Play music"}
            aria-pressed={musicPlaying}
          />
          <Button onClick={() => router.push("/")} text="&larr; Create a wish" />
        </div>
      </main>

      {/*
        The capture source for "Download as Image". It has to be laid out for
        html-to-image to measure it, so it is parked off-screen rather than
        hidden with `display: none`.
      */}
      <div className={styles.captureFrame} aria-hidden="true">
        <div className={styles.card} ref={cardRef}>
          <AnimatedTitle name={name} className={styles.titleImg} />
          <p className={styles.descImg}>{wish}</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      >
        <source src="/media/hbd.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}
