import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-foreground mb-2">페이지를 찾을 수 없습니다</p>
      <p className="text-muted-foreground mb-8">
        이 주소의 포트폴리오가 존재하지 않거나 비공개 상태입니다.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
