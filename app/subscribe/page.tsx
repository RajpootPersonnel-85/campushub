"use client"

import { useState } from "react"
import { Check, X, Star, Gift, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const planFeatures = [
  {
    feature: "70,000+ Mock Tests",
    passPro: true,
    pass: true,
  },
  {
    feature: "Unlimited Pro Live Tests",
    passPro: true,
    pass: false,
  },
  {
    feature: "Unlimited Practice Pro Questions",
    passPro: true,
    pass: false,
  },
  {
    feature: "17,000+ Previous Year Papers",
    passPro: true,
    pass: false,
  },
  {
    feature: "Unlimited Re-Attempt mode for All Tests",
    passPro: true,
    pass: false,
  },
  {
    feature: "Detailed Performance Analytics",
    passPro: true,
    pass: false,
  },
  {
    feature: "Priority Customer Support",
    passPro: true,
    pass: false,
  },
  {
    feature: "Offline Content Download",
    passPro: true,
    pass: false,
  },
]

const pricingPlans = [
  {
    id: "monthly",
    name: "Monthly Testbook Pass",
    duration: "Valid for 31 Days",
    originalPrice: 899,
    discountedPrice: 549,
    discount: "39% OFF",
    popular: false,
  },
  {
    id: "yearly",
    name: "Yearly Testbook Pass",
    duration: "Valid for 365 Days",
    originalPrice: 1399,
    discountedPrice: 599,
    discount: "57% OFF",
    popular: true,
    badge: "Bestseller",
  },
  {
    id: "18months",
    name: "18 Months Testbook Pass",
    duration: "Valid for 548 Days",
    originalPrice: 1599,
    discountedPrice: 749,
    discount: "53% OFF",
    popular: false,
  },
]

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState("yearly")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(false)

  const selectedPlanDetails = pricingPlans.find((plan) => plan.id === selectedPlan)
  const finalPrice = appliedCoupon ? selectedPlanDetails?.discountedPrice! - 50 : selectedPlanDetails?.discountedPrice!

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "student50") {
      setAppliedCoupon(true)
    } else {
      alert("Invalid coupon code")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your CampusHub Plan</h1>
            <p className="text-muted-foreground">Unlock premium features and accelerate your learning</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Comparison */}
          <div className="lg:col-span-2">
            {/* Plan Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-muted p-1 rounded-lg inline-flex">
                <Button
                  variant="ghost"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-state="active"
                >
                  Pass Pro
                  <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                    Suggested
                  </Badge>
                </Button>
                <Button variant="ghost" className="text-muted-foreground">
                  Pass
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                    Basic
                  </Badge>
                </Button>
              </div>
            </div>

            {/* Features Comparison */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Plan Benefits</CardTitle>
                <CardDescription>Compare features across different plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {planFeatures.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <span className="font-medium">{item.feature}</span>
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Pass Pro</span>
                          {item.passPro ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Pass</span>
                          {item.pass ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>What Students Say</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-sm mb-2">
                      "CampusHub Pro helped me ace my exams with unlimited practice tests!"
                    </p>
                    <p className="text-xs text-muted-foreground">- Priya S., Engineering Student</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-sm mb-2">
                      "The previous year papers collection is incredible. Worth every penny!"
                    </p>
                    <p className="text-xs text-muted-foreground">- Rahul K., MBA Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Special Offers for You!</CardTitle>
                  <Button variant="outline" size="sm" className="text-primary bg-transparent">
                    Apply Coupon
                  </Button>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Exciting offers available</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Grab the best deals now, Hurry up!</p>
                  <Button variant="link" size="sm" className="text-primary p-0 h-auto mt-1">
                    Login For Offers
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Select your Pass Pro Plan:</h3>
                  <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3">
                    {pricingPlans.map((plan) => (
                      <div key={plan.id} className="relative">
                        <Label
                          htmlFor={plan.id}
                          className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedPlan === plan.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={plan.id} id={plan.id} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{plan.name}</p>
                                <p className="text-xs text-muted-foreground">{plan.duration}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground line-through">
                                    ₹{plan.originalPrice}
                                  </span>
                                  <span className="font-bold text-lg">₹{plan.discountedPrice}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Label>
                        {plan.popular && (
                          <Badge className="absolute -top-2 left-4 bg-green-600 text-white">{plan.badge}</Badge>
                        )}
                        {plan.discount && (
                          <Badge variant="secondary" className="absolute -top-2 right-4 bg-green-100 text-green-800">
                            {plan.discount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Coupon Section */}
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">Coupon applied! You saved ₹50</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Try code: STUDENT50 for extra discount</p>
                </div>

                {/* Price Summary */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plan Price:</span>
                    <span className="text-sm">₹{selectedPlanDetails?.discountedPrice}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="text-sm">Coupon Discount:</span>
                      <span className="text-sm">-₹50</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between font-bold text-lg pt-2 border-t">
                    <span>To Pay</span>
                    <div className="flex items-center space-x-1">
                      <Info className="w-4 h-4 text-muted-foreground" />
                      <span>₹{finalPrice}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                  Proceed To Payment
                </Button>

                {/* Security Note */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">🔒 Secure payment powered by Razorpay</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                  your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer student discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! We offer special student pricing. Verify your student status to unlock additional discounts.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit/debit cards, UPI, net banking, and digital wallets through Razorpay.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer a 7-day free trial for new users. No credit card required to start your trial.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
