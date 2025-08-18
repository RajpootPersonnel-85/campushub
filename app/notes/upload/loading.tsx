import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Form Cards Skeleton */}
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <div className="p-6">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48 mb-4" />

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>

                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-20 w-full" />
                      </div>

                      {/* File Upload Area Skeleton */}
                      <div className="border-2 border-dashed border-border rounded-lg p-8">
                        <Skeleton className="w-12 h-12 mx-auto mb-4" />
                        <Skeleton className="h-4 w-32 mx-auto mb-2" />
                        <Skeleton className="h-3 w-48 mx-auto" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <div className="p-6">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="space-y-2">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="w-2 h-2 rounded-full" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
