import { requireAdminPage } from "@/lib/admin"
import AdminSidebarWrapper from "./AdminSidebarWrapper"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebarWrapper />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
