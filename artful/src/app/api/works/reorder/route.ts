import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workIds } = await req.json()

    if (!Array.isArray(workIds) || workIds.length === 0) {
      return NextResponse.json({ error: "workIds가 필요합니다" }, { status: 400 })
    }

    // 소유권 검증: 유저의 포트폴리오에 속한 작품만 허용
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id },
      include: { works: { select: { id: true } } },
    })
    if (!portfolio) {
      return NextResponse.json({ error: "포트폴리오를 찾을 수 없습니다" }, { status: 404 })
    }

    const ownedIds = new Set(portfolio.works.map((w) => w.id))
    const allOwned = workIds.every((id: string) => ownedIds.has(id))
    if (!allOwned) {
      return NextResponse.json({ error: "권한이 없는 작품이 포함되어 있습니다" }, { status: 403 })
    }

    // 트랜잭션으로 일괄 업데이트
    await prisma.$transaction(
      workIds.map((id: string, index: number) =>
        prisma.work.update({ where: { id }, data: { order: index } })
      )
    )

    return NextResponse.json({ data: { success: true } })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
