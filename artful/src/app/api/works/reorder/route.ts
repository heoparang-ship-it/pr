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

    await Promise.all(
      workIds.map((id: string, index: number) =>
        prisma.work.update({ where: { id }, data: { order: index } })
      )
    )

    return NextResponse.json({ data: { success: true } })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
