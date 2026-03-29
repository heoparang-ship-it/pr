"use client"

import { usePortfolio } from "@/hooks/usePortfolio"
import { useEditorStore } from "@/stores/editorStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function DashboardPage() {
  const { loading, error } = usePortfolio()
  const portfolio = useEditorStore((s) => s.portfolio)
  const router = useRouter()

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>
  if (!portfolio) return null

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${portfolio.slug}`

  return (
    <div className="min-h-screen bg-background p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Artful</h1>
        <button
          onClick={() => router.push("/dashboard/edit")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          편집하기
        </button>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <div className="flex items-center gap-4">
          {portfolio.profileImage ? (
            <img src={portfolio.profileImage} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">
              {portfolio.artistName.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{portfolio.artistName}</h2>
            <p className="text-muted-foreground text-sm">{portfolio.genre || "장르 미설정"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${portfolio.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
            {portfolio.isPublished ? "발행됨" : "미발행"}
          </span>
          <span className="text-sm text-muted-foreground">
            작품 {portfolio.works.length}개 · 링크 {portfolio.links.length}개
          </span>
        </div>

        <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
          <code className="text-sm flex-1 truncate">{shareUrl}</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
              toast.success("링크가 복사되었습니다")
            }}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition"
          >
            복사
          </button>
        </div>
      </div>
    </div>
  )
}
