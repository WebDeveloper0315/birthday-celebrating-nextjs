/**
 * The twelve confetti themes, one per set. Replaces a 96-line if/else ladder in
 * which every branch built an identical config object around a different array.
 *
 * Set 7 used to be `[]` — js-confetti fell back to plain paper confetti, so one
 * burst in twelve had no emoji at all. It is now the birthday set, which is the
 * one theme a birthday app was conspicuously missing.
 */
export const CONFETTI_SETS: readonly (readonly string[])[] = [
  ['😀', '🤣', '😍', '😛', '😘', '😁'],
  ['🧡', '❤️', '💙', '💚', '💛', '🤎'],
  ['🤏', '👆', '👍', '🤚', '👌', '👊'],
  ['🌸', '🏵️', '🌹', '🥀', '🌷', '🌼'],
  ['🦄', '🐷', '🐏', '🐇', '🐼', '🐤'],
  ['🛰️', '🚠', '🚀', '🛸', '⌛', '✈️'],
  ['🎂', '🎁', '🎉', '🎈', '🥳', '🍰'],
  ['🎖️', '🏆', '🏅', '🥇', '🥈', '🥉'],
  ['⚽', '⚾', '🥎', '🏀', '🏐', '🏈'],
  ['💍', '📿', '💄', '💎', '👑', '🔔'],
  ['📖', '📘', '📒', '📃', '💰', '📕'],
  ['🌈', '🌧️', '🌞', '🌀', '🌟', '⛄'],
]

/** Shared burst geometry — previously copy-pasted twelve times. */
export const CONFETTI_BURST = {
  emojiSize: 15,
  confettiRadius: 6,
  confettiNumber: 70,
} as const
