import { auth } from "./auth"
import { NextResponse } from "next/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null }
  }
  if (session.user.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), session: null }
  }
  return { error: null, session }
}

export async function requireAdminPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "admin") redirect("/dashboard")
  return session
}
