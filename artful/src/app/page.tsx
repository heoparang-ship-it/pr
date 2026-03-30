import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* 네비게이션 */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            Art<span className="text-primary">ful</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
              로그인
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:bg-primary/90 transition"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center pt-14">
        {/* 배경 그래디언트 오브 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* 배지 */}
          <div className="animate-fade-in inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            For Musicians
          </div>

          <h1 className="animate-slide-up text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            당신의 음악,
            <br />
            <span className="text-primary">하나의 링크</span>로.
          </h1>

          <p className="animate-slide-up stagger-1 text-muted-foreground text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            작품을 업로드하고, 링크 하나로 팬에게 공유하세요.
            <br className="hidden md:block" />
            BGM이 흐르는 포트폴리오를 만들어보세요.
          </p>

          <div className="animate-slide-up stagger-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="group relative px-8 py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              무료로 시작하기
              <span className="ml-1.5 inline-block group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted/50 transition-all"
            >
              이미 계정이 있어요
            </Link>
          </div>

          {/* 소셜 프루프 */}
          <p className="animate-fade-in stagger-3 mt-10 text-xs text-muted-foreground">
            카드 등록 없이 무료 · 30초면 완성
          </p>
        </div>

        {/* 스크롤 힌트 */}
        <div className="absolute bottom-8 animate-bounce text-muted-foreground/40">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* 기능 */}
      <section className="py-28 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">뮤지션을 위해 만들었습니다</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group p-6 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg mb-4 group-hover:scale-110 transition-transform">
              🎵
            </div>
            <h3 className="font-bold text-lg mb-2">BGM 포트폴리오</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              팬이 당신의 페이지에 들어오면 음악이 흐릅니다. 첫인상부터 다르게.
            </p>
          </div>

          <div className="group p-6 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg mb-4 group-hover:scale-110 transition-transform">
              🎬
            </div>
            <h3 className="font-bold text-lg mb-2">작품 쇼케이스</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              영상, 이미지, 오디오를 깔끔한 그리드로 전시합니다.
            </p>
          </div>

          <div className="group p-6 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg mb-4 group-hover:scale-110 transition-transform">
              🔗
            </div>
            <h3 className="font-bold text-lg mb-2">원링크 공유</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              SNS, 스트리밍, 연락처를 한 페이지에 모아 공유하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 사용법 */}
      <section className="py-28 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">3단계로 완성</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "가입하기", desc: "이메일 또는 소셜 계정으로 30초 만에 가입" },
              { step: "02", title: "꾸미기", desc: "프로필, 작품, 링크를 추가하고 BGM을 설정" },
              { step: "03", title: "공유하기", desc: "링크 하나를 SNS 바이오에 넣으면 끝" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.03] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            지금 만들어보세요.
          </h2>
          <p className="text-muted-foreground mb-8">무료. 카드 등록 없이 바로 시작.</p>
          <Link
            href="/register"
            className="group inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            시작하기
            <span className="ml-2 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 text-center text-muted-foreground text-xs border-t border-border">
        <p>© 2026 Artful · 주식회사 엑스컴</p>
      </footer>
    </div>
  )
}
