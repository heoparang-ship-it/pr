"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/users", label: "유저 관리", icon: "👤" },
  { href: "/admin/portfolios", label: "포트폴리오", icon: "🎨" },
  { href: "/admin/reports", label: "신고 관리", icon: "🚨" },
  { href: "/admin/analytics", label: "분석", icon: "📈" },
]

export default function AdminSidebar({ pendingReports = 0 }: { pendingReports?: number }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 border-r border-border bg-card min-h-screen p-4 shrink-0">
      <Link href="/admin" className="text-lg font-bold block mb-6">
        Artful Admin
      </Link>
      <nav className="space-y-1">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.href === "/admin/reports" && pendingReports > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {pendingReports}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 pt-4 border-t border-border">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
          ← 대시보드로
        </Link>
      </div>
    </aside>
  )
}
