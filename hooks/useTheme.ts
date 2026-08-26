"use client"

import { useCallback, useEffect, useState } from "react"
import { findTheme, resolveTheme, themes, type Theme } from "@/utils/themes"

export { themes, findTheme, resolveTheme, DEFAULT_THEME } from "@/utils/themes"
export type { Theme } from "@/utils/themes"

/**
 * Holds the active theme and mirrors it onto the `--color` custom property.
 *
 * This is component-local state, not a shared store — each caller gets its own
 * copy. Pass `initialId` rather than calling `setTheme` from a mount effect:
 * the latter paints the default colour for one frame before correcting itself.
 */
export default function useTheme(initialId?: string | number | null) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => resolveTheme(initialId))

  // Unknown ids are ignored rather than resetting to the default.
  const setTheme = useCallback((id: string | number) => {
    const next = findTheme(id)
    if (next) setCurrentTheme(next)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty("--color", currentTheme.color)
  }, [currentTheme])

  return { themes, setTheme, currentTheme }
}
