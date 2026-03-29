import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import SoundTemplate from "@/components/templates/SoundTemplate"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: params.slug, isPublished: true },
  })

  if (!portfolio) return { title: "Not Found" }

  return {
    title: `${portfolio.artistName} | Artful`,
    description: portfolio.bio || `${portfolio.artistName}의 포트폴리오`,
    openGraph: {
      title: portfolio.artistName,
      description: portfolio.bio || `${portfolio.artistName}의 포트폴리오`,
      images: portfolio.heroImage
        ? [{ url: portfolio.heroImage, width: 1200, height: 630 }]
        : [],
    },
  }
}

export default async function SlugPage({
  params,
}: {
  params: { slug: string }
}) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: {
      works: { orderBy: { order: "asc" } },
      links: { orderBy: { order: "asc" } },
    },
  })

  if (!portfolio) notFound()

  return <SoundTemplate portfolio={portfolio as never} />
}
