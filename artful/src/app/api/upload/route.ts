import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createPresignedUrl } from "@/lib/s3"

export const runtime = "nodejs"

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "audio/mpeg",
  "audio/wav",
]

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileName, fileType, category } = await req.json()

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: "지원하지 않는 파일 형식입니다" }, { status: 400 })
    }

    const result = await createPresignedUrl(
      session.user.id,
      category,
      fileName,
      fileType
    )

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
