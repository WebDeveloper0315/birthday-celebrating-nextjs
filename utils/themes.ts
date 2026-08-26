/**
 * The theme palette. Deliberately free of `"use client"` so it can be imported
 * by server components and by the OG-image route, not just by the hook.
 */
export type Theme = {
  id: number
  name: string
  color: string
}

export const themes: readonly Theme[] = [
  { id: 0, name: "blue", color: "#0070f3" },
  { id: 1, name: "green", color: "#10b981" },
  { id: 2, name: "violet", color: "#8b5cf6" },
  { id: 3, name: "yellow", color: "#fbbf24" },
  { id: 4, name: "red", color: "#e11d48" },
]

export const DEFAULT_THEME = themes[0]

/** Look up a theme by id. Ids arrive as strings from the URL, so compare as strings. */
export function findTheme(id: string | number | null | undefined): Theme | undefined {
  if (id === null || id === undefined) return undefined
  return themes.find((theme) => String(theme.id) === String(id))
}

/** Resolve a theme id to a theme, falling back to the default. */
export function resolveTheme(id: string | number | null | undefined): Theme {
  return findTheme(id) ?? DEFAULT_THEME
}
