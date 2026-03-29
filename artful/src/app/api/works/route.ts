import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getYouTubeThumbnail, isYouTubeUrl } from "@/lib/utils"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id },
      include: { works: true },
    })
    if (!portfolio) {
      return NextResponse.json({ error: "포트폴리오를 찾을 수 없습니다" }, { status: 404 })
    }

    const body = await req.json()

    // [12회차] 입력 검증
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json({ error: "제목을 입력해주세요" }, { status: 400 })
    }
    if (!body.mediaUrl || typeof body.mediaUrl !== "string") {
      return NextResponse.json({ error: "미디어 URL을 입력해주세요" }, { status: 400 })
    }
    if (!["VIDEO", "AUDIO", "IMAGE"].includes(body.type)) {
      return NextResponse.json({ error: "올바른 미디어 타입이 아닙니다" }, { status: 400 })
    }

    // BGM 설정 시 기존 BGM 해제
    if (body.isBgm) {
      await prisma.work.updateMany({
        where: { portfolioId: portfolio.id, isBgm: true },
        data: { isBgm: false, autoPlay: false },
      })
    }

    // YouTube URL이면 자동 썸네일
    let thumbnailUrl = body.thumbnailUrl || null
    if (!thumbnailUrl && isYouTubeUrl(body.mediaUrl)) {
      thumbnailUrl = getYouTubeThumbnail(body.mediaUrl)
    }

    const work = await prisma.work.create({
      data: {
        portfolioId: portfolio.id,
        title: body.title,
        type: body.type,
        mediaUrl: body.mediaUrl,
        thumbnailUrl,
        isBgm: body.isBgm || false,
        autoPlay: body.isBgm || false,
        order: portfolio.works.length,
      },
    })

    return NextResponse.json({ data: work }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
