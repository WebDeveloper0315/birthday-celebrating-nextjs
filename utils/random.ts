/**
 * Random integer in [min, max] — BOTH ends inclusive.
 *
 * The previous helper computed `floor(random * (max - min)) + min`, which
 * silently excluded `max`. Every caller that passed a literal upper bound was
 * quietly one short, so the twelfth confetti set never fired.
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Uniformly random element of a non-empty array. No bounds arithmetic at the call site. */
export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * Stable 32-bit hash of a string. Used to pick a wish deterministically from a
 * name so that (a) the server and the client agree during hydration and
 * (b) everyone who opens a shared link sees the same message.
 */
export function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(hash, 31) + input.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/** Pick an element deterministically from a seed string. */
export function pickFor<T>(items: readonly T[], seed: string): T {
  return items[hashString(seed) % items.length]
}

/** `decodeURIComponent` that returns the input instead of throwing on malformed escapes. */
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
