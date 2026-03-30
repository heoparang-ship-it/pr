"use client"

import Link from "next/link"
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
    if (!email.includes("@")) {
      toast.error("올바른 이메일을 입력해주세요")
      return
    }
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        toast.error("이메일 또는 비밀번호가 올바르지 않습니다")
      } else {
        router.push("/dashboard")
      }
    } catch {
      toast.error("로그인 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm animate-scale-in">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight mb-2">
            Art<span className="text-primary">ful</span>
          </Link>
          <p className="text-muted-foreground text-sm">뮤지션을 위한 포트폴리오</p>
        </div>

        {/* 소셜 로그인 */}
        <div className="space-y-2.5">
          <button
            onClick={() => signIn("kakao", { callbackUrl: "/dashboard" })}
            className="w-full py-3 px-4 bg-[#FEE500] text-black text-sm font-semibold rounded-xl hover:brightness-95 transition"
          >
            카카오로 시작하기
          </button>
          <button
            onClick={() => signIn("naver", { callbackUrl: "/dashboard" })}
            className="w-full py-3 px-4 bg-[#03C75A] text-white text-sm font-semibold rounded-xl hover:brightness-95 transition"
          >
            네이버로 시작하기
          </button>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-3 px-4 bg-background text-foreground text-sm font-semibold rounded-xl border border-border hover:bg-muted transition"
          >
            구글로 시작하기
          </button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* 이메일 로그인 */}
        <form onSubmit={handleCredentials} className="space-y-2.5">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-3 px-4 bg-muted border border-border text-foreground text-sm rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full py-3 px-4 bg-muted border border-border text-foreground text-sm rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 하단 링크 */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          계정이 없으신가요?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            가입하기
          </Link>
        </p>
      </div>
    </div>
  )
}
