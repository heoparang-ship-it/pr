"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import StatusBadge from "@/components/admin/StatusBadge"
import { toast } from "sonner"

interface UserRow {
  id: string
  email: string
  name: string | null
  provider: string | null
  role: string
  isBanned: boolean
  createdAt: string
  portfolio: { slug: string; artistName: string; isPublished: boolean; _count: { pageViews: number } } | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchUsers = async (p: number, s: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/users?page=${p}&search=${encodeURIComponent(s)}`)
    const json = await res.json()
    setUsers(json.data.users)
    setTotal(json.data.totalPages)
    setLoading(false)
  }

  useEffect(() => { fetchUsers(page, search) }, [page, search])

  const handleBan = async (id: string, current: boolean) => {
    if (!confirm(current ? "밴을 해제하시겠습니까?" : "이 유저를 밴하시겠습니까?")) return
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: !current }),
    })
    toast.success(current ? "밴이 해제되었습니다" : "유저가 밴되었습니다")
    fetchUsers(page, search)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까? 모든 데이터가 삭제됩니다.")) return
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("유저가 삭제되었습니다")
      fetchUsers(page, search)
    } else {
      const json = await res.json()
      toast.error(json.error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">유저 관리</h1>
      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        placeholder="이메일 또는 이름 검색..."
        className="w-full max-w-md mb-4 py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
      />

      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3">유저</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">가입경로</th>
                  <th className="text-left px-4 py-3">상태</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">조회수</th>
                  <th className="text-right px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/users/${u.id}`} className="hover:text-primary">
                        <p className="font-medium">{u.name || "이름 없음"}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{u.provider || "credentials"}</td>
                    <td className="px-4 py-3 space-x-1">
                      <StatusBadge status={u.role} />
                      {u.isBanned && <StatusBadge status="banned" />}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {u.portfolio?._count.pageViews || 0}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleBan(u.id, u.isBanned)} className="text-xs text-yellow-400 hover:text-yellow-300">
                        {u.isBanned ? "해제" : "밴"}
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="text-xs text-red-400 hover:text-red-300">
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
