"use client"

import Link from "next/link"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3">오류가 발생했습니다</h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          예상치 못한 오류가 발생했습니다.<br />잠시 후 다시 시도해주세요.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted/50 transition"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
