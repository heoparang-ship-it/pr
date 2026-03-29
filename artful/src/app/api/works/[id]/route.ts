import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { deleteS3Object } from "@/lib/s3"

export const runtime = "nodejs"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const work = await prisma.work.findUnique({
      where: { id: params.id },
      include: { portfolio: true },
    })
    if (!work || work.portfolio.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await req.json()

    if (body.isBgm) {
      await prisma.work.updateMany({
        where: { portfolioId: work.portfolioId, isBgm: true, id: { not: params.id } },
        data: { isBgm: false, autoPlay: false },
      })
    }

    const updated = await prisma.work.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const work = await prisma.work.findUnique({
      where: { id: params.id },
      include: { portfolio: true },
    })
    if (!work || work.portfolio.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // S3 파일 삭제 (외부 URL이면 무시)
    if (work.mediaUrl && !work.mediaUrl.includes("youtube.com") && !work.mediaUrl.includes("soundcloud.com")) {
      await deleteS3Object(work.mediaUrl)
    }
    if (work.thumbnailUrl) {
      await deleteS3Object(work.thumbnailUrl)
    }

    await prisma.work.delete({ where: { id: params.id } })

    return NextResponse.json({ data: { success: true } })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
