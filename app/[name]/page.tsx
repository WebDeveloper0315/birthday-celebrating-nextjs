import type { Metadata } from "next"

import Wish from "./Wish"
import messages from "@/utils/birthdayWishes"
import { pickFor, safeDecode } from "@/utils/random"

type PageProps = {
  params: Promise<{ name: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * Per-name metadata. The whole point of this app is that you copy the link and
 * send it to someone; until now every link unfurled as the same static
 * "Happy Birthday to you!" with no image.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const person = safeDecode(name)
  const title = `Happy Birthday ${person}!`
  const description = pickFor(messages, person)

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function WishPage({ params, searchParams }: PageProps) {
  const { name } = await params
  const { color } = await searchParams

  return <Wish name={safeDecode(name)} themeId={typeof color === "string" ? color : null} />
}
