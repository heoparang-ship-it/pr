import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalUsers,
    totalPortfolios,
    publishedPortfolios,
    totalPageViews,
    totalWorks,
    signupsToday,
    viewsToday,
    pendingReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.portfolio.count(),
    prisma.portfolio.count({ where: { isPublished: true } }),
    prisma.pageView.count(),
    prisma.work.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.pageView.count({ where: { viewedAt: { gte: today } } }),
    prisma.report.count({ where: { status: "pending" } }),
  ])

  return NextResponse.json({
    data: {
      totalUsers,
      totalPortfolios,
      publishedPortfolios,
      totalPageViews,
      totalWorks,
      signupsToday,
      viewsToday,
      pendingReports,
    },
  })
}
