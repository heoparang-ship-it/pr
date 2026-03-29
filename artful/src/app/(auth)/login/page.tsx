"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      toast.error("이메일 또는 비밀번호가 올바르지 않습니다")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Artful</h1>
          <p className="text-muted-foreground mt-1">당신의 음악, 하나의 링크로</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("kakao", { callbackUrl: "/dashboard" })}
            className="w-full py-3 px-4 rounded-lg bg-[#FEE500] text-black font-medium hover:bg-[#FDD800] transition"
          >
            카카오로 시작하기
          </button>
          <button
            onClick={() => signIn("naver", { callbackUrl: "/dashboard" })}
            className="w-full py-3 px-4 rounded-lg bg-[#03C75A] text-white font-medium hover:bg-[#02B550] transition"
          >
            네이버로 시작하기
          </button>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-3 px-4 rounded-lg bg-white text-black font-medium hover:bg-gray-100 transition border border-gray-300"
          >
            구글로 시작하기
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleCredentials} className="space-y-3">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-3 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full py-3 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <a href="/register" className="text-primary hover:underline">
            가입하기
          </a>
        </p>
      </div>
    </div>
  )
}
