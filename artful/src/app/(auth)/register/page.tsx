"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다")
      return
    }

    setLoading(true)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error)
      setLoading(false)
      return
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)

    if (result?.error) {
      toast.error("가입은 되었으나 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.")
      router.push("/login")
    } else {
      router.push("/dashboard")
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
          <p className="text-muted-foreground text-sm">새 계정 만들기</p>
        </div>

        {/* 소셜 가입 */}
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

        {/* 이메일 가입 */}
        <form onSubmit={handleRegister} className="space-y-2.5">
          <input
            type="text"
            placeholder="아티스트명"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full py-3 px-4 bg-muted border border-border text-foreground text-sm rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition"
          />
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
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full py-3 px-4 bg-muted border border-border text-foreground text-sm rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>

        {/* 하단 링크 */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
