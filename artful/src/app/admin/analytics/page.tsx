"use client"

import { useEffect, useState } from "react"

interface AnalyticsData {
  dailySignups: Array<{ date: string; count: number }>
  dailyPageViews: Array<{ date: string; count: number }>
  topPortfolios: Array<{ slug: string; artistName: string; views: number }>
  deviceBreakdown: { mobile: number; desktop: number }
}

function BarChart({ data, label }: { data: Array<{ date: string; count: number }>; label: string }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="font-bold mb-4">{label}</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm">데이터 없음</p>
      ) : (
        <div className="flex items-end gap-1 h-32">
          {data.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{d.count || ""}</span>
              <div
                className="w-full bg-primary/60 rounded-t min-h-[2px]"
                style={{ height: `${(d.count / max) * 100}%` }}
              />
              <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                {d.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then((j) => setData(j.data))
      .finally(() => setLoading(false))
  }, [period])

  const totalDevice = (data?.deviceBreakdown.mobile || 0) + (data?.deviceBreakdown.desktop || 0)
  const mobilePercent = totalDevice > 0 ? Math.round(((data?.deviceBreakdown.mobile || 0) / totalDevice) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">분석</h1>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-sm ${period === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {p === "7d" ? "7일" : p === "30d" ? "30일" : "90일"}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <BarChart data={data.dailySignups} label="일별 가입자" />
            <BarChart data={data.dailyPageViews} label="일별 조회수" />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold mb-3">디바이스 비율</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${mobilePercent}%` }} />
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                모바일 {mobilePercent}% / 데스크톱 {100 - mobilePercent}%
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold mb-3">인기 포트폴리오 TOP 10</h3>
            <div className="space-y-2">
              {data.topPortfolios.map((p, i) => (
                <div key={p.slug} className="flex items-center gap-3 py-1">
                  <span className="text-muted-foreground text-sm w-6">{i + 1}</span>
                  <span className="font-medium flex-1">{p.artistName}</span>
                  <span className="text-muted-foreground text-sm">/{p.slug}</span>
                  <span className="text-sm font-medium">{p.views.toLocaleString()}회</span>
                </div>
              ))}
              {data.topPortfolios.length === 0 && (
                <p className="text-muted-foreground text-sm">데이터 없음</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
