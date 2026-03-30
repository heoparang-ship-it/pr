export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold tracking-tight mb-1">Art<span className="text-primary">ful</span></p>
        <p className="text-muted-foreground text-xs">불러오는 중...</p>
      </div>
    </div>
  )
}
