import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    const link = await prisma.link.findUnique({
      where: { id: params.id },
      include: { portfolio: true },
    })
    if (!link || link.portfolio.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await req.json()

    // Whitelist allowed fields to prevent mass-assignment
    const updated = await prisma.link.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: String(body.title) }),
        ...(body.url !== undefined && { url: String(body.url) }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.order !== undefined && { order: Number(body.order) }),
      },
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

    const link = await prisma.link.findUnique({
      where: { id: params.id },
      include: { portfolio: true },
    })
    if (!link || link.portfolio.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.link.delete({ where: { id: params.id } })
    return NextResponse.json({ data: { success: true } })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
