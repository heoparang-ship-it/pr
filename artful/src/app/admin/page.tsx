import { prisma } from "@/lib/prisma"
import StatsCard from "@/components/admin/StatsCard"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalUsers, totalPortfolios, published, totalViews, totalWorks, signupsToday, pendingReports, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.portfolio.count(),
      prisma.portfolio.count({ where: { isPublished: true } }),
      prisma.pageView.count(),
      prisma.work.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, email: true, name: true, createdAt: true } }),
    ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard icon="👤" label="전체 유저" value={totalUsers} sub={`오늘 +${signupsToday}`} />
        <StatsCard icon="🎨" label="포트폴리오" value={totalPortfolios} sub={`발행 ${published}`} />
        <StatsCard icon="👁" label="전체 조회수" value={totalViews} />
        <StatsCard icon="🎵" label="전체 작품" value={totalWorks} />
      </div>

      {pendingReports > 0 && (
        <Link
          href="/admin/reports"
          className="block mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
        >
          🚨 대기 중인 신고 {pendingReports}건이 있습니다 →
        </Link>
      )}

      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="font-bold mb-3">최근 가입</h2>
        <div className="space-y-2">
          {recentUsers.map((u) => (
            <Link
              key={u.id}
              href={`/admin/users/${u.id}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted transition"
            >
              <div>
                <span className="font-medium">{u.name || "이름 없음"}</span>
                <span className="text-muted-foreground text-sm ml-2">{u.email}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {u.createdAt.toLocaleDateString("ko-KR")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
