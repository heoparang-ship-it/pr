import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import bcrypt from "bcryptjs"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        provider: "credentials",
      },
    })

    // 포트폴리오 자동 생성
    let slug = generateSlug(name)
    const slugExists = await prisma.portfolio.findUnique({ where: { slug } })
    if (slugExists) {
      slug += "-" + Math.random().toString(36).slice(2, 6)
    }
    await prisma.portfolio.create({
      data: { userId: user.id, slug, artistName: name || "아티스트" },
    })

    return NextResponse.json({ data: { userId: user.id } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 })
  }
}
