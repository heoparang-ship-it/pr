"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminSidebarWrapper() {
  const [pending, setPending] = useState(0)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((j) => setPending(j.data?.pendingReports || 0))
      .catch(() => {})
  }, [])

  return <AdminSidebar pendingReports={pending} />
}
