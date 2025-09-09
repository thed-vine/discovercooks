"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Users, Check, Star, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  minGuests: number
  maxGuests: number
}

interface Chef {
  id: string
  name: string
  avatar: string
  cuisine: string
  rating: number
  location: string
  priceRange: string
  services: Service[]
  availability: {
    nextAvailable: string
    timeSlots: string[]
  }
}

interface BookingData {
  service: Service | null
  date: string
  time: string
  guests: number
  location: string
  specialRequests: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
}

interface BookingFlowProps {
  chef: Chef
}

const steps = [
  { id: 1, title: "Service", description: "Choose your experience" },
  { id: 2, title: "Details", description: "Date, time & location" },
  { id: 3, title: "Contact", description: "Your information" },
  { id: 4, title: "Confirm", description: "Review & book" },
]

export function BookingFlow({ chef }: BookingFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    date: "",
    time: "",
    guests: 2,
    location: "",
    specialRequests: "",
    contactInfo: {
      name: "",
      email: "",
      phone: "",
    },
  })

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleServiceSelect = (service: Service) => {
    setBookingData((prev) => ({ ...prev, service }))
    setCurrentStep(2)
  }

  const handleBookingConfirm = () => {
    // In a real app, this would submit to an API
    console.log("Booking confirmed:", bookingData)
    router.push(`/booking-success?chef=${chef.id}`)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.service !== null
      case 2:
        return bookingData.date && bookingData.time && bookingData.location && bookingData.guests > 0
      case 3:
        return bookingData.contactInfo.name && bookingData.contactInfo.email && bookingData.contactInfo.phone
      case 4:
        return true
      default:
        return false
    }
  }

  const getTotalPrice = () => {
    if (!bookingData.service) return 0
    return bookingData.service.price * bookingData.guests
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-semibold">Book Chef {chef.name.split(" ")[0]}</h1>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <div className="text-xs text-center mt-1">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chef Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={chef.avatar || "/placeholder.svg"} alt={chef.name} />
            <AvatarFallback>
              {chef.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">{chef.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{chef.cuisine}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-yellow-400" />
                <span>{chef.rating}</span>
              </div>
              <span>{chef.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Choose Your Experience</h3>
                {chef.services.map((service) => (
                  <Card
                    key={service.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      bookingData.service?.id === service.id && "ring-2 ring-primary",
                    )}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{service.name}</h4>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          ${service.price}/person
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {service.minGuests}-{service.maxGuests} guests
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Event Details</h3>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label>Time</Label>
                  <RadioGroup
                    value={bookingData.time}
                    onValueChange={(value) => setBookingData((prev) => ({ ...prev, time: value }))}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {chef.availability.timeSlots.map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <RadioGroupItem value={time} id={time} />
                          <Label htmlFor={time} className="flex-1 cursor-pointer">
                            {time}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Number of Guests */}
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    value={bookingData.guests}
                    onChange={(e) =>
                      setBookingData((prev) => ({ ...prev, guests: Number.parseInt(e.target.value) || 0 }))
                    }
                    min={bookingData.service?.minGuests || 1}
                    max={bookingData.service?.maxGuests || 12}
                  />
                  {bookingData.service && (
                    <p className="text-sm text-muted-foreground">
                      Min: {bookingData.service.minGuests}, Max: {bookingData.service.maxGuests} guests
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter your address"
                    value={bookingData.location}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="requests"
                    placeholder="Dietary restrictions, preferences, or special occasions..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Contact Information</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={bookingData.contactInfo.name}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, name: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={bookingData.contactInfo.email}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, email: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={bookingData.contactInfo.phone}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, phone: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Booking Summary</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-primary" />
                      {bookingData.service?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(bookingData.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{bookingData.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{bookingData.guests} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{bookingData.location}</span>
                      </div>
                    </div>

                    {bookingData.specialRequests && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-sm font-medium mb-1">Special Requests:</p>
                        <p className="text-sm text-muted-foreground">{bookingData.specialRequests}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Cost:</span>
                        <span className="text-xl font-bold text-primary">${getTotalPrice()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${bookingData.service?.price}/person × {bookingData.guests} guests
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{bookingData.contactInfo.name}</p>
                      <p>{bookingData.contactInfo.email}</p>
                      <p>{bookingData.contactInfo.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
              Back
            </Button>
          )}
          <Button
            onClick={currentStep === 4 ? handleBookingConfirm : handleNext}
            disabled={!canProceed()}
            className="flex-1"
          >
            {currentStep === 4 ? "Confirm Booking" : "Continue"}
            {currentStep < 4 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
