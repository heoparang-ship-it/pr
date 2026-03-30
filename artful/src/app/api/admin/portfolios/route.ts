import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)
  const search = searchParams.get("search") || ""
  const published = searchParams.get("published")

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { slug: { contains: search, mode: "insensitive" } },
      { artistName: { contains: search, mode: "insensitive" } },
    ]
  }
  if (published === "true") where.isPublished = true
  if (published === "false") where.isPublished = false

  const [portfolios, total] = await Promise.all([
    prisma.portfolio.findMany({
      where,
      include: {
        user: { select: { email: true, name: true, isBanned: true } },
        _count: { select: { works: true, links: true, pageViews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.portfolio.count({ where }),
  ])

  return NextResponse.json({
    data: {
      portfolios,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  })
}
