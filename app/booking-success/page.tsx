"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, Calendar, Home, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

interface BookingData {
  id: string
  service_type: string
  event_date: string
  event_time: string
  guest_count: number
  total_price: number
  chef: {
    name: string
  }
}

export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const chefId = searchParams.get("chef")
  const [showConfetti, setShowConfetti] = useState(true)
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("No booking ID provided")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id,
            service_type,
            event_date,
            event_time,
            guest_count,
            total_price,
            chef:chefs(name)
          `)
          .eq("id", bookingId)
          .single()

        if (error) {
          console.error("Error fetching booking:", error)
          setError("Failed to load booking details")
        } else {
          // Fix: Supabase returns chef as an array, but we expect an object
          setBooking({
            ...data,
            chef: Array.isArray(data.chef) ? data.chef[0] : data.chef,
          })
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || "We couldn't find your booking details."}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatServiceType = (serviceType: string) => {
    return serviceType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

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
                #{booking.id.slice(-8).toUpperCase()}
              </div>
              <p className="text-sm text-muted-foreground">Save this reference number for your records</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chef:</span>
              <span className="font-medium">{booking.chef.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{formatServiceType(booking.service_type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{new Date(booking.event_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{booking.event_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests:</span>
              <span className="font-medium">{booking.guest_count}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-primary">${booking.total_price}</span>
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