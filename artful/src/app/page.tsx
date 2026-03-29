import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          당신의 음악,<br />
          <span className="text-primary">하나의 링크로</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-md">
          포트폴리오를 만들고, 링크 하나로 팬에게 공유하세요.<br />
          BGM이 깔리는 아티스트 쇼케이스 페이지.
        </p>
        <Link
          href="/register"
          className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-medium hover:bg-primary/90 transition"
        >
          무료로 시작하기
        </Link>
        <p className="text-muted-foreground text-sm mt-4">카카오 · 네이버 · 구글 계정으로 바로 시작</p>
      </section>

      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="font-bold mb-2">BGM이 깔리는 포트폴리오</h3>
            <p className="text-muted-foreground text-sm">팬이 링크를 클릭하면 당신의 음악이 자동 재생됩니다</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold mb-2">Behance급 비주얼</h3>
            <p className="text-muted-foreground text-sm">작품을 아름다운 카드 그리드로 전시하세요</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-bold mb-2">Linktree보다 강력한 링크</h3>
            <p className="text-muted-foreground text-sm">SNS, 스트리밍, 연락처를 한 페이지에 모아 공유</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">지금 바로 만들어보세요</h2>
        <p className="text-muted-foreground mb-8">무료입니다. 카드 등록 없이 바로 시작.</p>
        <Link
          href="/register"
          className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-medium hover:bg-primary/90 transition"
        >
          무료로 시작하기
        </Link>
      </section>

      <footer className="py-8 text-center text-muted-foreground text-xs border-t border-border">
        <p>© 2026 Artful. All rights reserved.</p>
      </footer>
    </div>
  )
}
