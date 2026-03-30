import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json()
  const updated = await prisma.portfolio.update({
    where: { id: params.id },
    data: {
      ...(body.isPublished !== undefined && { isPublished: Boolean(body.isPublished) }),
    },
  })

  return NextResponse.json({ data: updated })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  await prisma.portfolio.delete({ where: { id: params.id } })
  return NextResponse.json({ data: { success: true } })
}
