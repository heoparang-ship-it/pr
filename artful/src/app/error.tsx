"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-4xl font-bold text-red-400 mb-4">오류 발생</h1>
      <p className="text-muted-foreground mb-8">
        {error.message || "예상치 못한 오류가 발생했습니다."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
      >
        다시 시도
      </button>
    </div>
  )
}
