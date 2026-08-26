import { ImageResponse } from "next/og"

import messages from "@/utils/birthdayWishes"
import { hashString, pickFor, safeDecode } from "@/utils/random"
import { themes } from "@/utils/themes"

export const alt = "A birthday wish"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * The social preview card. Deliberately emoji-free: the OG renderer would have
 * to fetch an emoji font at request time to draw them, so the confetti here is
 * drawn as coloured dots instead.
 */
export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const person = safeDecode(name)
  const wish = pickFor(messages, person)

  // A tiny seeded generator so a given name always gets the same confetti.
  let seed = hashString(person) || 1
  const next = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }

  // Keep the middle of the card clear so confetti never lands on the name.
  const SAFE = { left: 90, right: 1110, top: 130, bottom: 520 }
  const outsideSafeArea = (x: number, y: number) =>
    x < SAFE.left || x > SAFE.right || y < SAFE.top || y > SAFE.bottom

  const dots = Array.from({ length: 55 }, (_, i) => {
    let left = next() * 1200
    let top = next() * 630
    // Rejection sampling, with a hard cap so a bad seed cannot spin forever.
    for (let attempt = 0; attempt < 20 && !outsideSafeArea(left, top); attempt++) {
      left = next() * 1200
      top = next() * 630
    }
    return {
      key: i,
      left,
      top,
      diameter: 8 + next() * 18,
      color: themes[Math.floor(next() * themes.length)].color,
      opacity: 0.3 + next() * 0.5,
      visible: outsideSafeArea(left, top),
    }
  }).filter((dot) => dot.visible)

  const accent = themes[hashString(person) % themes.length].color

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#26262b",
          color: "#f5f5dc",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {dots.map((dot) => (
          <div
            key={dot.key}
            style={{
              position: "absolute",
              left: dot.left,
              top: dot.top,
              width: dot.diameter,
              height: dot.diameter,
              borderRadius: dot.diameter,
              backgroundColor: dot.color,
              opacity: dot.opacity,
            }}
          />
        ))}

        <div style={{ fontSize: 44, letterSpacing: 10, textTransform: "uppercase", opacity: 0.75 }}>
          Happy Birthday
        </div>
        <div
          style={{
            fontSize: 108,
            fontWeight: 700,
            color: accent,
            maxWidth: 1040,
            textAlign: "center",
            lineHeight: 1.15,
            padding: "18px 0 26px",
          }}
        >
          {person}
        </div>
        <div style={{ fontSize: 28, maxWidth: 900, textAlign: "center", lineHeight: 1.45, opacity: 0.85 }}>
          {wish.length > 150 ? `${wish.slice(0, 147)}…` : wish}
        </div>
      </div>
    ),
    size,
  )
}
