"use client"

import Image from "next/image"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useEditorStore } from "@/stores/editorStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function DashboardPage() {
  const { loading, error } = usePortfolio()
  const portfolio = useEditorStore((s) => s.portfolio)
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium mb-2">오류가 발생했습니다</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!portfolio) return null

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${portfolio.slug}`

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Art<span className="text-primary">ful</span>
          </Link>
          <button
            onClick={() => router.push("/dashboard/edit")}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition"
          >
            편집하기
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
        {/* 프로필 카드 */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-4 mb-5">
            {portfolio.profileImage ? (
              <Image
                src={portfolio.profileImage}
                alt={portfolio.artistName}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold ring-2 ring-border">
                {portfolio.artistName.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{portfolio.artistName}</h2>
              <p className="text-muted-foreground text-sm">{portfolio.genre || "장르 미설정"}</p>
            </div>
          </div>

          {/* 상태 뱃지 */}
          <div className="flex items-center gap-3 mb-5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
              portfolio.isPublished
                ? "bg-success/10 text-success"
                : "bg-accent/10 text-accent"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                portfolio.isPublished ? "bg-success" : "bg-accent"
              }`} />
              {portfolio.isPublished ? "발행됨" : "미발행"}
            </span>
            <span className="text-sm text-muted-foreground">
              작품 {portfolio.works.length}개 · 링크 {portfolio.links.length}개
            </span>
          </div>

          {/* 공유 링크 */}
          <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
            <code className="text-sm flex-1 truncate text-muted-foreground font-mono">{shareUrl}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl)
                toast.success("링크가 복사되었습니다")
              }}
              className="shrink-0 px-3 py-1.5 bg-foreground text-background rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              복사
            </button>
          </div>
        </div>

        {/* 퀵 액션 */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => router.push("/dashboard/edit")}
            className="group p-5 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all text-left"
          >
            <span className="text-2xl mb-2 block">✏️</span>
            <span className="font-semibold text-sm group-hover:text-primary transition-colors">포트폴리오 편집</span>
            <span className="block text-xs text-muted-foreground mt-0.5">프로필, 작품, 링크 관리</span>
          </button>
          <button
            onClick={() => window.open(`/${portfolio.slug}`, "_blank")}
            className="group p-5 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all text-left"
          >
            <span className="text-2xl mb-2 block">👁️</span>
            <span className="font-semibold text-sm group-hover:text-primary transition-colors">미리보기</span>
            <span className="block text-xs text-muted-foreground mt-0.5">방문자에게 보이는 화면</span>
          </button>
        </div>
      </main>
    </div>
  )
}
