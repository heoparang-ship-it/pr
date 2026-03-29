import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id },
      include: { links: true },
    })
    if (!portfolio) {
      return NextResponse.json({ error: "포트폴리오를 찾을 수 없습니다" }, { status: 404 })
    }

    const body = await req.json()
    const link = await prisma.link.create({
      data: {
        portfolioId: portfolio.id,
        title: body.title,
        url: body.url,
        icon: body.icon || null,
        order: portfolio.links.length,
      },
    })

    return NextResponse.json({ data: link }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
