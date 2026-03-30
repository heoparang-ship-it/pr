"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-2xl mx-auto mb-4">
          ⚠️
        </div>
        <h1 className="text-xl font-bold mb-2">오류가 발생했습니다</h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
          {error.message || "예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
