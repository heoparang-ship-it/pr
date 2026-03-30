# CLAUDE.md

Artful — 뮤지션을 위한 포트폴리오 플랫폼. 작품을 업로드하고 링크 하나로 팬에게 공유.

## Project Structure

```
pr/
├── CLAUDE.md
└── artful/                    # Next.js 앱
    ├── prisma/schema.prisma   # DB 스키마 (User, Portfolio, Work, Link, PageView, Report)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                 # 랜딩 페이지
    │   │   ├── layout.tsx               # 루트 레이아웃 (테마, 폰트, Toaster)
    │   │   ├── ThemeScript.tsx           # 시스템 다크모드 자동 감지
    │   │   ├── (auth)/login/page.tsx     # 로그인 (카카오/네이버/구글/자체)
    │   │   ├── (auth)/register/page.tsx  # 회원가입
    │   │   ├── dashboard/               # 대시보드 + 에디터
    │   │   ├── admin/                   # 관리자 패널 (5페이지)
    │   │   ├── [slug]/page.tsx          # 공개 포트폴리오 (SSR)
    │   │   └── api/                     # API 라우트
    │   ├── components/
    │   │   ├── templates/SoundTemplate.tsx  # 뮤지션 포트폴리오 템플릿
    │   │   └── admin/                      # 관리자 UI 컴포넌트
    │   ├── lib/
    │   │   ├── auth.ts          # NextAuth v5 설정
    │   │   ├── admin.ts         # 관리자 가드 함수
    │   │   ├── prisma.ts        # Prisma 싱글톤
    │   │   ├── s3.ts            # AWS S3 Presigned URL
    │   │   └── utils.ts         # slug 생성, URL 감지 등
    │   ├── hooks/               # usePortfolio, useAutoSave, useUpload
    │   ├── stores/editorStore.ts # Zustand 에디터 상태관리
    │   └── types/               # TypeScript 인터페이스
    └── preview.html             # 디자인 미리보기 (독립 HTML)
```

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (CSS 변수 기반 라이트/다크 테마, 키컬러 #E60012)
- **DB**: PostgreSQL (Supabase) + Prisma ORM
- **Auth**: NextAuth.js v5 (카카오/네이버/구글/자체가입, JWT)
- **Storage**: AWS S3 (Presigned URL)
- **State**: Zustand
- **Deploy**: Vercel (예정)

## Common Commands

```bash
cd artful
npm install          # 의존성 설치
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npx next lint        # ESLint
npx tsc --noEmit     # TypeScript 체크
npx prisma migrate dev  # DB 마이그레이션
npx prisma generate     # Prisma 클라이언트 생성
```

## Design System

- **기본 테마**: 화이트 (라이트 모드)
- **다크 모드**: 디바이스 prefers-color-scheme 자동 감지
- **키컬러**: #E60012 (레드)
- **스타일**: 유니클로식 미니멀 — 직선적 버튼, 넉넉한 여백, tracking-tight 타이포
- **CSS 변수**: globals.css에 :root (라이트) / .dark (다크) 정의

## API Endpoints

### Public
- `GET /api/portfolio/[slug]` — 공개 포트폴리오 조회
- `POST /api/pageview` — 방문자 기록
- `POST /api/report` — 포트폴리오 신고

### Auth Required
- `GET/PUT /api/portfolio` — 내 포트폴리오 CRUD
- `POST /api/works` — 작품 추가
- `PUT/DELETE /api/works/[id]` — 작품 수정/삭제
- `PUT /api/works/reorder` — 순서 변경
- `POST /api/links` — 링크 추가
- `PUT/DELETE /api/links/[id]` — 링크 수정/삭제
- `POST /api/upload` — S3 Presigned URL 발급

### Admin Only (role="admin")
- `GET /api/admin/stats` — 전체 통계
- `GET /api/admin/users` — 유저 목록
- `GET/PATCH/DELETE /api/admin/users/[id]` — 유저 관리
- `GET /api/admin/portfolios` — 포트폴리오 목록
- `PATCH/DELETE /api/admin/portfolios/[id]` — 포트폴리오 관리
- `GET /api/admin/reports` — 신고 큐
- `PATCH /api/admin/reports/[id]` — 신고 처리
- `GET /api/admin/analytics` — 분석 데이터

## Key Architecture Decisions

- **JWT 세션** (어댑터 없이 가볍게) — role을 token에 전파
- **Presigned URL** — S3 직접 업로드로 서버 부하 제거
- **자동저장** — Zustand + 3초 디바운스 + API PUT
- **BGM** — 브라우저 정책 대응으로 Play 버튼 → 유저 인터랙션 후 재생
- **slug 예약어** — login, register, dashboard, api, admin 등 차단
- **PageView IP** — SHA256 해시만 저장 (개인정보보호)
- **관리자 가드** — requireAdmin() API용, requireAdminPage() 페이지용

## Security Checklist

- API 입력 검증 (title, URL, type, slug, gradient hex)
- Mass-assignment 방지 (필드 화이트리스트)
- 소유권 검증 (portfolioId === 본인)
- XSS 방지 (slug 영문/숫자/하이픈만, URL https:// 필수, gradient hex 검증)
- 밴 유저 로그인 차단
- 자기 강등/밴/삭제 방지

## Git Workflow

- **개발 브랜치**: `claude/add-claude-documentation-rDGTt`
- **미리보기**: `gh-pages` 브랜치 (GitHub Pages)
- 커밋 메시지: "why" 중심, 변경사항 구체적 명시
- 코드 변경 후 반드시 `npx tsc --noEmit && npx next lint && npm run build` 통과 확인

## Notes for AI Assistants

- 항상 파일을 먼저 읽고 수정할 것
- 요청받은 것만 구현, 불필요한 리팩토링 금지
- 기존 파일 수정 우선, 신규 파일 최소화
- API 응답 형식: `{ data: T }` 성공, `{ error: "msg" }` 에러
- 관리자 API는 반드시 `requireAdmin()` 가드 사용
- 테마 변경 시 CSS 변수만 수정 (globals.css)
