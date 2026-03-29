import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isValidSlug } from "@/lib/utils"

export const runtime = "nodejs"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id },
      include: {
        works: { orderBy: { order: "asc" } },
        links: { orderBy: { order: "asc" } },
      },
    })

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: session.user.id,
          slug: `artist-${Math.random().toString(36).slice(2, 8)}`,
          artistName: session.user.name || "아티스트",
        },
        include: {
          works: { orderBy: { order: "asc" } },
          links: { orderBy: { order: "asc" } },
        },
      })
    }

    return NextResponse.json({ data: portfolio })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // [15회차] artistName 빈값 방지
    if (body.artistName !== undefined && (!body.artistName || body.artistName.trim().length === 0)) {
      return NextResponse.json({ error: "아티스트명은 비워둘 수 없습니다" }, { status: 400 })
    }

    // [16회차] bio 길이 제한 (서버에서도 체크)
    if (body.bio && body.bio.length > 200) {
      return NextResponse.json({ error: "바이오는 200자 이내로 입력해주세요" }, { status: 400 })
    }

    // Gradient CSS injection 방지: hex color만 허용
    const hexColorRegex = /^#[0-9a-fA-F]{3,8}$/
    if (body.gradientFrom && !hexColorRegex.test(body.gradientFrom)) {
      return NextResponse.json({ error: "올바른 색상 값이 아닙니다" }, { status: 400 })
    }
    if (body.gradientTo && !hexColorRegex.test(body.gradientTo)) {
      return NextResponse.json({ error: "올바른 색상 값이 아닙니다" }, { status: 400 })
    }

    // heroImage/profileImage URL 검증: http(s)만 허용
    if (body.heroImage && !body.heroImage.startsWith("https://")) {
      return NextResponse.json({ error: "이미지 URL은 https://로 시작해야 합니다" }, { status: 400 })
    }
    if (body.profileImage && !body.profileImage.startsWith("https://")) {
      return NextResponse.json({ error: "이미지 URL은 https://로 시작해야 합니다" }, { status: 400 })
    }

    if (body.slug && !isValidSlug(body.slug)) {
      return NextResponse.json(
        { error: "slug는 영문, 숫자, 하이픈만 사용 가능합니다 (3~30자)" },
        { status: 400 }
      )
    }

    if (body.slug) {
      const existing = await prisma.portfolio.findUnique({
        where: { slug: body.slug },
      })
      if (existing && existing.userId !== session.user.id) {
        return NextResponse.json({ error: "이미 사용 중인 주소입니다" }, { status: 400 })
      }
    }

    const portfolio = await prisma.portfolio.update({
      where: { userId: session.user.id },
      data: {
        artistName: body.artistName,
        bio: body.bio,
        genre: body.genre,
        heroImage: body.heroImage,
        profileImage: body.profileImage,
        gradientFrom: body.gradientFrom,
        gradientTo: body.gradientTo,
        slug: body.slug,
        isPublished: body.isPublished,
      },
      include: {
        works: { orderBy: { order: "asc" } },
        links: { orderBy: { order: "asc" } },
      },
    })

    return NextResponse.json({ data: portfolio })
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
