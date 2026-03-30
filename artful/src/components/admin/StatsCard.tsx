interface Props {
  label: string
  value: number | string
  icon: string
  sub?: string
}

export default function StatsCard({ label, value, icon, sub }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}
