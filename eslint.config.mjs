// ESLint 9+ flat config. `.eslintrc.json` is legacy and is not read at all once
// this file exists.
//
// Version note: eslint-config-next 16 bundles eslint-plugin-react 7.37, whose
// peer range stops at ESLint 9, and typescript-eslint 8, whose peer range stops
// below TypeScript 6.1. So ESLint and TypeScript are held at 9.x and 6.x here —
// the newest releases the whole toolchain actually agrees on.
import next from "eslint-config-next/core-web-vitals"

const config = [
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
  ...next,
]

export default config
