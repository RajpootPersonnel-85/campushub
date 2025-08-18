import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="flex-1 h-10" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 lg:hidden" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="w-80 space-y-6 hidden lg:block">
            <Card>
              <div className="p-6 space-y-6">
                <Skeleton className="h-6 w-16" />
                {/* Category Filter */}
                <div>
                  <Skeleton className="h-4 w-16 mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
                {/* Condition Filter */}
                <div>
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
                {/* Price Range */}
                <div>
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-full" />
                </div>
                {/* Subject Filter */}
                <div>
                  <Skeleton className="h-4 w-16 mb-3" />
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* View Controls Skeleton */}
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>

            {/* Books Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="h-full">
                  <div className="aspect-[3/4] bg-muted rounded-t-lg">
                    <Skeleton className="w-full h-full rounded-t-lg" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-3" />

                    <div className="flex justify-between items-center mb-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>

                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
