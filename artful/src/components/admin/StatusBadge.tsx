const STYLES: Record<string, string> = {
  published: "bg-green-500/20 text-green-400",
  unpublished: "bg-yellow-500/20 text-yellow-400",
  admin: "bg-purple-500/20 text-purple-400",
  user: "bg-blue-500/20 text-blue-400",
  banned: "bg-red-500/20 text-red-400",
  pending: "bg-orange-500/20 text-orange-400",
  reviewed: "bg-green-500/20 text-green-400",
  dismissed: "bg-gray-500/20 text-gray-400",
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${STYLES[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  )
}
