import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createHash } from "crypto"

export const runtime = "nodejs"

const VALID_REASONS = ["spam", "inappropriate", "copyright", "other"]

export async function POST(req: Request) {
  try {
    const { portfolioId, reason, description } = await req.json()

    if (!portfolioId || !reason) {
      return NextResponse.json({ error: "portfolioId와 reason은 필수입니다" }, { status: 400 })
    }
    if (!VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: "올바른 신고 사유가 아닙니다" }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } })
    if (!portfolio) {
      return NextResponse.json({ error: "포트폴리오를 찾을 수 없습니다" }, { status: 404 })
    }

    // IP 해시로 중복 신고 방지 (같은 포트폴리오에 24시간 내)
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded?.split(",")[0]?.trim() || "unknown"
    const reporterIpHash = createHash("sha256").update(ip).digest("hex")

    const recent = await prisma.report.findFirst({
      where: {
        portfolioId,
        reporterIpHash,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    })
    if (recent) {
      return NextResponse.json({ error: "이미 신고한 포트폴리오입니다" }, { status: 429 })
    }

    const report = await prisma.report.create({
      data: {
        portfolioId,
        reason,
        description: description?.slice(0, 500) || null,
        reporterIpHash,
      },
    })

    return NextResponse.json({ data: report }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
