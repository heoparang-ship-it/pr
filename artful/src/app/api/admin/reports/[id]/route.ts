import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAdmin()
  if (error) return error

  const body = await req.json()
  if (!["reviewed", "dismissed"].includes(body.status)) {
    return NextResponse.json({ error: "올바른 상태값이 아닙니다" }, { status: 400 })
  }

  const report = await prisma.report.update({
    where: { id: params.id },
    data: {
      status: body.status,
      reviewedBy: session!.user.id,
      reviewedAt: new Date(),
    },
    include: { portfolio: true },
  })

  // "reviewed" 처리 시 포트폴리오 비공개 전환
  if (body.status === "reviewed" && report.portfolio.isPublished) {
    await prisma.portfolio.update({
      where: { id: report.portfolioId },
      data: { isPublished: false },
    })
  }

  return NextResponse.json({ data: report })
}
