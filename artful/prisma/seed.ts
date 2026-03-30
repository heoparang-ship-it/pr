import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "test"
  const password = "test"
  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "admin", password: hashedPassword },
    create: {
      email,
      name: "Master Admin",
      password: hashedPassword,
      provider: "credentials",
      role: "admin",
      isBanned: false,
    },
  })

  // 관리자 포트폴리오 자동 생성
  await prisma.portfolio.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      slug: "admin",
      artistName: "Master Admin",
    },
  })

  console.log("✅ 마스터 관리자 계정 생성 완료")
  console.log(`   아이디: ${email}`)
  console.log(`   비밀번호: ${password}`)
  console.log(`   역할: admin`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
