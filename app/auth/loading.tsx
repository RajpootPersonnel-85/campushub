import { BookOpen } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="absolute inset-0 bg-primary rounded-lg animate-ping opacity-20"></div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-1">CampusHub</h2>
          <p className="text-sm text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    </div>
  )
}
