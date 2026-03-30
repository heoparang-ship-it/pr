"use client"

import { useEffect, useState } from "react"
import StatusBadge from "@/components/admin/StatusBadge"
import { toast } from "sonner"

interface ReportRow {
  id: string
  reason: string
  description: string | null
  status: string
  createdAt: string
  portfolio: { id: string; slug: string; artistName: string; isPublished: boolean }
}

const TABS = ["pending", "reviewed", "dismissed"] as const

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([])
  const [tab, setTab] = useState<string>("pending")
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/reports?status=${tab}`)
    const json = await res.json()
    setReports(json.data.reports)
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchReports() }, [tab])

  const handleAction = async (id: string, status: "reviewed" | "dismissed") => {
    const label = status === "reviewed" ? "처리 (포트폴리오 비공개 전환)" : "무시"
    if (!confirm(`이 신고를 ${label}하시겠습니까?`)) return
    await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    toast.success(status === "reviewed" ? "신고가 처리되었습니다" : "신고가 무시되었습니다")
    fetchReports()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">신고 관리</h1>

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "pending" ? "대기" : t === "reviewed" ? "처리됨" : "무시됨"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : reports.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">해당 상태의 신고가 없습니다</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={r.reason} />
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="font-medium">
                    {r.portfolio.artistName} <span className="text-muted-foreground text-sm">/{r.portfolio.slug}</span>
                  </p>
                  {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>

                {r.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(r.id, "reviewed")}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition"
                    >
                      처리
                    </button>
                    <button
                      onClick={() => handleAction(r.id, "dismissed")}
                      className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded text-xs hover:bg-gray-500/30 transition"
                    >
                      무시
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
