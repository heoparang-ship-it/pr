"use client"

import { useEffect, useState } from "react"
import StatusBadge from "@/components/admin/StatusBadge"
import { toast } from "sonner"

interface PortfolioRow {
  id: string
  slug: string
  artistName: string
  isPublished: boolean
  createdAt: string
  user: { email: string; name: string | null; isBanned: boolean }
  _count: { works: number; links: number; pageViews: number }
}

export default function AdminPortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PortfolioRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [published, setPublished] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), search })
    if (published !== "all") params.set("published", published)
    const res = await fetch(`/api/admin/portfolios?${params}`)
    const json = await res.json()
    setPortfolios(json.data.portfolios)
    setTotal(json.data.totalPages)
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData() }, [page, search, published])

  const handleToggle = async (id: string, current: boolean) => {
    await fetch(`/api/admin/portfolios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    })
    toast.success(current ? "비공개로 전환되었습니다" : "발행되었습니다")
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("이 포트폴리오를 삭제하시겠습니까?")) return
    await fetch(`/api/admin/portfolios/${id}`, { method: "DELETE" })
    toast.success("포트폴리오가 삭제되었습니다")
    fetchData()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">포트폴리오 관리</h1>
      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="아티스트명 또는 slug 검색..."
          className="flex-1 max-w-md py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <select
          value={published}
          onChange={(e) => { setPublished(e.target.value); setPage(1) }}
          className="py-2 px-3 bg-muted border border-border rounded-lg"
        >
          <option value="all">전체</option>
          <option value="true">발행됨</option>
          <option value="false">미발행</option>
        </select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3">아티스트</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">유저</th>
                  <th className="text-left px-4 py-3">상태</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">작품/조회</th>
                  <th className="text-right px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {portfolios.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.artistName}</p>
                      <p className="text-xs text-muted-foreground">/{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{p.user.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.isPublished ? "published" : "unpublished"} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {p._count.works}개 / {p._count.pageViews}회
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleToggle(p.id, p.isPublished)} className="text-xs text-blue-400 hover:text-blue-300">
                        {p.isPublished ? "비공개" : "발행"}
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-300">
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded text-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
