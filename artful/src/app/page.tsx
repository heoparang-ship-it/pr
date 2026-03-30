import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 네비게이션 */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">Artful</span>
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
            로그인
          </Link>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-14">
        <p className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">For Musicians</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
          당신의 음악,<br />하나의 링크로.
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-md leading-relaxed">
          작품을 업로드하고, 링크 하나로 팬에게 공유하세요.
        </p>
        <Link
          href="/register"
          className="px-8 py-3.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
        >
          무료로 시작하기
        </Link>
      </section>

      {/* 기능 */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">01</p>
            <h3 className="font-bold text-lg mb-2">BGM 포트폴리오</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">팬이 당신의 페이지에 들어오면 음악이 흐릅니다.</p>
          </div>
          <div>
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">02</p>
            <h3 className="font-bold text-lg mb-2">작품 쇼케이스</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">영상과 이미지를 깔끔한 그리드로 전시합니다.</p>
          </div>
          <div>
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">03</p>
            <h3 className="font-bold text-lg mb-2">원링크 공유</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">SNS, 스트리밍, 연락처를 한 페이지에 모아 공유.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center border-t border-border">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">지금 만들어보세요.</h2>
        <p className="text-muted-foreground mb-8 text-sm">무료. 카드 등록 없이 바로 시작.</p>
        <Link
          href="/register"
          className="px-8 py-3.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
        >
          시작하기
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="py-6 text-center text-muted-foreground text-xs border-t border-border">
        © 2026 Artful
      </footer>
    </div>
  )
}
