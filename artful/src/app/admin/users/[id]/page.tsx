/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import StatusBadge from "@/components/admin/StatusBadge"
import AdminUserActions from "./AdminUserActions"

export const dynamic = "force-dynamic"

export default async function AdminUserDetail({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      portfolio: {
        include: { _count: { select: { works: true, links: true, pageViews: true } } },
      },
    },
  })

  if (!user) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">유저 상세</h1>

      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {user.profileImage ? (
            <img src={user.profileImage} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">
              {(user.name || user.email).charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{user.name || "이름 없음"}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <StatusBadge status={user.role} />
            {user.isBanned && <StatusBadge status="banned" />}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">가입경로</p>
            <p className="font-medium">{user.provider || "credentials"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">가입일</p>
            <p className="font-medium">{user.createdAt.toLocaleDateString("ko-KR")}</p>
          </div>
          {user.portfolio && (
            <>
              <div>
                <p className="text-muted-foreground">포트폴리오</p>
                <p className="font-medium">{user.portfolio.artistName} (/{user.portfolio.slug})</p>
              </div>
              <div>
                <p className="text-muted-foreground">작품/링크/조회수</p>
                <p className="font-medium">
                  {user.portfolio._count.works} / {user.portfolio._count.links} / {user.portfolio._count.pageViews}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <AdminUserActions userId={user.id} role={user.role} isBanned={user.isBanned} />
    </div>
  )
}
