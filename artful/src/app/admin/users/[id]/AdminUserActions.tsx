"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Props {
  userId: string
  role: string
  isBanned: boolean
}

export default function AdminUserActions({ userId, role, isBanned }: Props) {
  const router = useRouter()

  const handleRole = async () => {
    const newRole = role === "admin" ? "user" : "admin"
    if (!confirm(`이 유저를 ${newRole === "admin" ? "관리자로 승격" : "일반 유저로 강등"}하시겠습니까?`)) return
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      toast.success("역할이 변경되었습니다")
      router.refresh()
    } else {
      const json = await res.json()
      toast.error(json.error)
    }
  }

  const handleBan = async () => {
    if (!confirm(isBanned ? "밴을 해제하시겠습니까?" : "이 유저를 밴하시겠습니까?")) return
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: !isBanned }),
    })
    if (res.ok) {
      toast.success(isBanned ? "밴이 해제되었습니다" : "유저가 밴되었습니다")
      router.refresh()
    } else {
      const json = await res.json()
      toast.error(json.error)
    }
  }

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까? 모든 데이터가 영구 삭제됩니다.")) return
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("유저가 삭제되었습니다")
      router.push("/admin/users")
    } else {
      const json = await res.json()
      toast.error(json.error)
    }
  }

  return (
    <div className="flex gap-3">
      <button onClick={handleRole} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition">
        {role === "admin" ? "일반 유저로 강등" : "관리자로 승격"}
      </button>
      <button onClick={handleBan} className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition">
        {isBanned ? "밴 해제" : "밴 처리"}
      </button>
      <button onClick={handleDelete} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition">
        유저 삭제
      </button>
    </div>
  )
}
