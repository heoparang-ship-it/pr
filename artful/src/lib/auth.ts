import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { prisma } from "./prisma"
import { generateSlug } from "./utils"
import bcrypt from "bcryptjs"

// 카카오 커스텀 Provider
const Kakao = {
  id: "kakao",
  name: "Kakao",
  type: "oidc" as const,
  issuer: "https://kauth.kakao.com",
  clientId: process.env.AUTH_KAKAO_ID,
  clientSecret: process.env.AUTH_KAKAO_SECRET,
  profile(profile: Record<string, unknown>) {
    return {
      id: String(profile.sub),
      name: (profile as { nickname?: string }).nickname ?? null,
      email: (profile as { email?: string }).email ?? null,
      image: (profile as { picture?: string }).picture ?? null,
    }
  },
}

// 네이버 커스텀 Provider (expires_in string 워크어라운드)
const Naver = {
  id: "naver",
  name: "Naver",
  type: "oauth" as const,
  authorization: {
    url: "https://nid.naver.com/oauth2.0/authorize",
    params: { response_type: "code" },
  },
  token: {
    url: "https://nid.naver.com/oauth2.0/token",
    async conform(response: Response) {
      const body = await response.json()
      if (typeof body.expires_in === "string") {
        body.expires_in = parseInt(body.expires_in, 10)
      }
      return new Response(JSON.stringify(body), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      })
    },
  },
  userinfo: "https://openapi.naver.com/v1/nid/me",
  clientId: process.env.AUTH_NAVER_ID,
  clientSecret: process.env.AUTH_NAVER_SECRET,
  profile(profile: Record<string, unknown>) {
    const resp = (profile as { response?: Record<string, string> }).response ?? {}
    return {
      id: resp.id ?? "",
      name: resp.name ?? resp.nickname ?? null,
      email: resp.email ?? null,
      image: resp.profile_image ?? null,
    }
  },
}

async function createDefaultPortfolio(userId: string, name: string | null) {
  let slug = generateSlug(name)
  const exists = await prisma.portfolio.findUnique({ where: { slug } })
  if (exists) {
    slug += "-" + Math.random().toString(36).slice(2, 6)
  }
  await prisma.portfolio.create({
    data: { userId, slug, artistName: name || "아티스트" },
  })
}

export const authConfig: NextAuthConfig = {
  providers: [
    Kakao,
    Naver,
    Google,
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.password) return null
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        return isValid
          ? { id: user.id, email: user.email, name: user.name }
          : null
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) return true

      if (account.provider !== "credentials") {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!existing) {
          // 카카오 이메일 없는 경우 대응
          const email =
            user.email || `${account.provider}_${account.providerAccountId}@artful.local`
          const newUser = await prisma.user.create({
            data: {
              email,
              name: user.name,
              provider: account.provider,
              profileImage: user.image,
            },
          })
          await createDefaultPortfolio(newUser.id, user.name ?? null)
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email ?? "" },
        })
        if (dbUser) {
          token.userId = dbUser.id
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string
      }
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
