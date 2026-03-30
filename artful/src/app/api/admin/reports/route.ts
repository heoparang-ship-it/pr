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
  const status = searchParams.get("status") || "pending"

  const where = ["pending", "reviewed", "dismissed"].includes(status)
    ? { status }
    : {}

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        portfolio: {
          select: { id: true, slug: true, artistName: true, isPublished: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.report.count({ where }),
  ])

  return NextResponse.json({
    data: {
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  })
}
