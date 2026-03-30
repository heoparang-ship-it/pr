import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="animate-scale-in">
        <p className="text-[120px] md:text-[160px] font-extrabold text-primary/10 leading-none select-none mb-2">404</p>
        <h1 className="text-2xl font-bold mb-3">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground text-sm mb-10 max-w-xs mx-auto leading-relaxed">
          이 주소의 포트폴리오가 존재하지 않거나<br />비공개 상태입니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
