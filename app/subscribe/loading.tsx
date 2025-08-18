import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SubscribeLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-primary/5 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Skeleton className="h-8 w-96 mx-auto mb-2" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Comparison Skeleton */}
          <div className="lg:col-span-2">
            {/* Plan Tabs Skeleton */}
            <div className="flex justify-center mb-8">
              <Skeleton className="h-12 w-80" />
            </div>

            {/* Features Comparison Skeleton */}
            <Card className="mb-8">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <Skeleton className="h-4 w-48" />
                      <div className="flex items-center space-x-8">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-5 w-5" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Skeleton */}
            <Card className="bg-primary/5">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-5 w-48 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-20 w-full" />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-16" />
                  </div>
                  <Skeleton className="h-3 w-48" />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex items-center justify-between font-bold text-lg pt-2 border-t">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>

                <Skeleton className="h-12 w-full" />

                <div className="text-center">
                  <Skeleton className="h-3 w-48 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
