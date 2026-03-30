import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      portfolio: {
        include: {
          _count: { select: { works: true, links: true, pageViews: true } },
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "유저를 찾을 수 없습니다" }, { status: 404 })
  }

  return NextResponse.json({ data: user })
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAdmin()
  if (error) return error

  const body = await req.json()

  // 자기 자신 보호
  if (params.id === session!.user.id) {
    if (body.role === "user") {
      return NextResponse.json({ error: "자신의 관리자 권한을 제거할 수 없습니다" }, { status: 400 })
    }
    if (body.isBanned === true) {
      return NextResponse.json({ error: "자신을 밴할 수 없습니다" }, { status: 400 })
    }
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: {
      ...(body.role !== undefined && ["user", "admin"].includes(body.role) && { role: body.role }),
      ...(body.isBanned !== undefined && { isBanned: Boolean(body.isBanned) }),
    },
  })

  return NextResponse.json({ data: updated })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAdmin()
  if (error) return error

  if (params.id === session!.user.id) {
    return NextResponse.json({ error: "자신을 삭제할 수 없습니다" }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ data: { success: true } })
}
