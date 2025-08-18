import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Form Cards Skeleton */}
              {[...Array(4)].map((_, i) => (
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
                  <div className="space-y-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j}>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-full" />
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
