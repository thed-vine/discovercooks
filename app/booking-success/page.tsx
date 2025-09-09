"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, Calendar, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"

export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chefId = searchParams.get("chef")
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Success Icon */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="h-10 w-10 text-green-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your chef booking has been successfully submitted. You'll receive a confirmation email shortly.
          </p>
        </div>

        {/* Booking Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Booking Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-primary mb-2">
                #CHF{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </div>
              <p className="text-sm text-muted-foreground">Save this reference number for your records</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Chef Confirmation</p>
                <p className="text-sm text-muted-foreground">Your chef will confirm availability within 2-4 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Menu Planning</p>
                <p className="text-sm text-muted-foreground">Discuss menu preferences and dietary requirements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Enjoy Your Experience</p>
                <p className="text-sm text-muted-foreground">Relax and enjoy your personalized culinary experience</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={() => router.push("/bookings")} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            View My Bookings
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
