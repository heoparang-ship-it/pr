import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const period = searchParams.get("period") || "30d"
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30

  const since = new Date()
  since.setDate(since.getDate() - days)

  // 일별 가입자
  const dailySignups = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
    SELECT DATE("createdAt") as date, COUNT(*)::int as count
    FROM "User"
    WHERE "createdAt" >= ${since}
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `

  // 일별 조회수
  const dailyPageViews = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
    SELECT DATE("viewedAt") as date, COUNT(*)::int as count
    FROM "PageView"
    WHERE "viewedAt" >= ${since}
    GROUP BY DATE("viewedAt")
    ORDER BY date ASC
  `

  // 인기 포트폴리오 TOP 10
  const topPortfolios = await prisma.portfolio.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      artistName: true,
      _count: { select: { pageViews: true } },
    },
    orderBy: { pageViews: { _count: "desc" } },
    take: 10,
  })

  // 디바이스 비율
  const [mobile, desktop] = await Promise.all([
    prisma.pageView.count({ where: { device: "mobile", viewedAt: { gte: since } } }),
    prisma.pageView.count({ where: { device: "desktop", viewedAt: { gte: since } } }),
  ])

  return NextResponse.json({
    data: {
      dailySignups: dailySignups.map((r) => ({ date: String(r.date), count: Number(r.count) })),
      dailyPageViews: dailyPageViews.map((r) => ({ date: String(r.date), count: Number(r.count) })),
      topPortfolios: topPortfolios.map((p) => ({
        slug: p.slug,
        artistName: p.artistName,
        views: p._count.pageViews,
      })),
      deviceBreakdown: { mobile, desktop },
    },
  })
}
