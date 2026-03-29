import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createHash } from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { slug, referrer, userAgent } = await req.json()

    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
    })
    if (!portfolio) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded?.split(",")[0]?.trim() || "unknown"
    const ipHash = createHash("sha256").update(ip).digest("hex")
    const device = /mobile/i.test(userAgent || "") ? "mobile" : "desktop"

    const recent = await prisma.pageView.findFirst({
      where: {
        portfolioId: portfolio.id,
        ipHash,
        viewedAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
      },
    })

    if (!recent) {
      await prisma.pageView.create({
        data: {
          portfolioId: portfolio.id,
          ipHash,
          device,
          referrer: referrer || null,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
