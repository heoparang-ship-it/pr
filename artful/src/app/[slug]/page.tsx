import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import SoundTemplate from "@/components/templates/SoundTemplate"
import type { Portfolio } from "@/types"

export const revalidate = 60
export const runtime = "nodejs"

// [21회차] slug에 XSS 방지 — 영문/숫자/하이픈만 허용
function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-z0-9-]/g, "").slice(0, 30)
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = sanitizeSlug(params.slug)
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug, isPublished: true },
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
      type: "profile",
    },
    // [22회차] Twitter Card 추가
    twitter: {
      card: "summary_large_image",
      title: portfolio.artistName,
      description: portfolio.bio || `${portfolio.artistName}의 포트폴리오`,
      images: portfolio.heroImage ? [portfolio.heroImage] : [],
    },
  }
}

export default async function SlugPage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = sanitizeSlug(params.slug)
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug, isPublished: true },
    include: {
      works: { orderBy: { order: "asc" } },
      links: { orderBy: { order: "asc" } },
    },
  })

  if (!portfolio) notFound()

  // [23회차] Prisma 리턴 타입을 Portfolio 인터페이스로 안전하게 변환
  const data: Portfolio = {
    id: portfolio.id,
    userId: portfolio.userId,
    slug: portfolio.slug,
    artistName: portfolio.artistName,
    bio: portfolio.bio,
    genre: portfolio.genre,
    heroImage: portfolio.heroImage,
    profileImage: portfolio.profileImage,
    gradientFrom: portfolio.gradientFrom,
    gradientTo: portfolio.gradientTo,
    isPublished: portfolio.isPublished,
    createdAt: portfolio.createdAt,
    updatedAt: portfolio.updatedAt,
    works: portfolio.works.map((w) => ({
      id: w.id,
      portfolioId: w.portfolioId,
      title: w.title,
      type: w.type as "VIDEO" | "AUDIO" | "IMAGE",
      mediaUrl: w.mediaUrl,
      thumbnailUrl: w.thumbnailUrl,
      isBgm: w.isBgm,
      autoPlay: w.autoPlay,
      order: w.order,
      createdAt: w.createdAt,
    })),
    links: portfolio.links.map((l) => ({
      id: l.id,
      portfolioId: l.portfolioId,
      title: l.title,
      url: l.url,
      icon: l.icon as Portfolio["links"][0]["icon"],
      order: l.order,
    })),
  }

  return <SoundTemplate portfolio={data} />
}
