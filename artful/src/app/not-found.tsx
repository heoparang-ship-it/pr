import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="animate-scale-in">
        <p className="text-8xl font-extrabold text-primary/20 mb-2">404</p>
        <h1 className="text-xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
          이 주소의 포트폴리오가 존재하지 않거나 비공개 상태입니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
