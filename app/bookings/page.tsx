"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, MapPin, Users, Phone, MessageCircle, Star, ChefHat } from "lucide-react"

// Mock booking data
const mockBookings = {
  upcoming: [
    {
      id: "1",
      chef: {
        name: "Marco Rodriguez",
        avatar: "/chef-portrait.png",
        rating: 4.9,
        specialty: "Italian Cuisine",
      },
      service: "Private Dinner Party",
      date: "2024-01-15",
      time: "7:00 PM",
      location: "Your Home",
      guests: 6,
      price: 450,
      status: "confirmed",
      bookingRef: "CHF-2024-001",
    },
    {
      id: "2",
      chef: {
        name: "Sarah Chen",
        avatar: "/chef-portrait.png",
        rating: 4.8,
        specialty: "Asian Fusion",
      },
      service: "Cooking Class",
      date: "2024-01-20",
      time: "2:00 PM",
      location: "Chef's Kitchen",
      guests: 4,
      price: 280,
      status: "pending",
      bookingRef: "CHF-2024-002",
    },
  ],
  past: [
    {
      id: "3",
      chef: {
        name: "David Kim",
        avatar: "/chef-portrait.png",
        rating: 4.7,
        specialty: "Korean BBQ",
      },
      service: "Family Meal Prep",
      date: "2023-12-10",
      time: "10:00 AM",
      location: "Your Home",
      guests: 4,
      price: 320,
      status: "completed",
      bookingRef: "CHF-2023-045",
      reviewed: true,
    },
  ],
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const BookingCard = ({ booking, isPast = false }: { booking: any; isPast?: boolean }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
      <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
                <AvatarImage src={booking.chef.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <ChefHat className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg font-semibold truncate">{booking.chef.name}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <span>{booking.chef.rating}</span>
                  <span>•</span>
                  <span className="truncate">{booking.chef.specialty}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(booking.status)} flex-shrink-0 text-xs`}>{booking.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground mb-2 text-sm sm:text-base">{booking.service}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{booking.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>{booking.guests} guests</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t gap-3">
            <div>
              <span className="text-lg font-semibold text-foreground">${booking.price}</span>
              <span className="text-sm text-muted-foreground ml-1">total</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isPast && (
                <>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl bg-transparent">
                    <Phone className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Call</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Message</span>
                  </Button>
                </>
              )}
              {isPast && !booking.reviewed && (
                <Button size="sm" className="bg-primary text-white flex-1 sm:flex-none rounded-xl">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Review</span>
                </Button>
              )}
              {isPast && booking.reviewed && (
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl bg-transparent">
                  <span className="hidden sm:inline">Book Again</span>
                </Button>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Booking Reference: {booking.bookingRef}</div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
  <div className="fixed inset-0 h-screen w-screen bg-gray-50 overflow-hidden" style={{ maxHeight: '100dvh', minHeight: '100dvh', height: '100dvh' }}>
      <div className="bg-white border-b">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your chef experiences</p>
        </div>
      </div>

  <div className="p-4 h-[calc(100dvh-64px)] overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming" className="text-sm">
              Upcoming ({mockBookings.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="text-sm">
              Past ({mockBookings.past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {mockBookings.upcoming.length > 0 ? (
              mockBookings.upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <div className="text-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground mb-4">Ready to book your next culinary experience?</p>
                <Button className="bg-primary text-white">Discover Chefs</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {mockBookings.past.length > 0 ? (
              mockBookings.past.map((booking) => <BookingCard key={booking.id} booking={booking} isPast={true} />)
            ) : (
              <div className="text-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No past bookings</h3>
                <p className="text-muted-foreground">Your booking history will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
