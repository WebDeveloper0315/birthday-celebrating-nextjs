import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Fail the production build on type errors instead of shipping them.
  // (`eslint` is no longer a next.config key — Next 16 removed `next lint`;
  // linting runs from the `lint` npm script against eslint.config.mjs.)
  typescript: { ignoreBuildErrors: false },
}

export default nextConfig
