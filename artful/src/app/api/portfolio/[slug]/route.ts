import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createHash } from "crypto"

export const runtime = "nodejs"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug: params.slug, isPublished: true },
      include: {
        works: { orderBy: { order: "asc" } },
        links: { orderBy: { order: "asc" } },
      },
    })

    if (!portfolio) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // 비동기 방문자 기록
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded?.split(",")[0]?.trim() || "unknown"
    const ipHash = createHash("sha256").update(ip).digest("hex")
    const userAgent = req.headers.get("user-agent") || ""
    const device = /mobile/i.test(userAgent) ? "mobile" : "desktop"
    const referrer = req.headers.get("referer") || null

    // 15분 내 중복 방문 체크
    const recent = await prisma.pageView.findFirst({
      where: {
        portfolioId: portfolio.id,
        ipHash,
        viewedAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
      },
    })

    if (!recent) {
      prisma.pageView
        .create({
          data: { portfolioId: portfolio.id, ipHash, device, referrer },
        })
        .catch(() => {})
    }

    return NextResponse.json({ data: portfolio })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
