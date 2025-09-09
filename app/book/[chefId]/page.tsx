import { BookingFlow } from "@/components/booking-flow"
import { notFound } from "next/navigation"

// Mock chef data for booking
const mockChefs = {
  "1": {
    id: "1",
    name: "Marco Rodriguez",
    avatar: "/chef-portrait.png",
    cuisine: "Italian",
    rating: 4.9,
    location: "New York, NY",
    priceRange: "$$$",
    services: [
      {
        id: "dinner-party",
        name: "Private Dinner Party",
        description: "Intimate dining experience with personalized menu",
        price: 150,
        duration: "3-4 hours",
        minGuests: 2,
        maxGuests: 12,
      },
      {
        id: "cooking-class",
        name: "Cooking Class",
        description: "Learn authentic Italian techniques hands-on",
        price: 75,
        duration: "2-3 hours",
        minGuests: 1,
        maxGuests: 8,
      },
      {
        id: "meal-prep",
        name: "Meal Prep Service",
        description: "Weekly meal preparation for busy schedules",
        price: 45,
        duration: "Per meal",
        minGuests: 1,
        maxGuests: 4,
      },
    ],
    availability: {
      nextAvailable: "Tomorrow",
      timeSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
    },
  },
  "2": {
    id: "2",
    name: "Sakura Tanaka",
    avatar: "/japanese-chef-portrait.png",
    cuisine: "Japanese",
    rating: 4.8,
    location: "Los Angeles, CA",
    priceRange: "$$$$",
    services: [
      {
        id: "omakase",
        name: "Omakase Experience",
        description: "Chef's choice sushi and sashimi tasting menu",
        price: 200,
        duration: "2-3 hours",
        minGuests: 2,
        maxGuests: 8,
      },
      {
        id: "sushi-class",
        name: "Sushi Making Class",
        description: "Learn traditional sushi preparation techniques",
        price: 95,
        duration: "3 hours",
        minGuests: 1,
        maxGuests: 6,
      },
    ],
    availability: {
      nextAvailable: "This weekend",
      timeSlots: ["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
    },
  },
}

interface BookingPageProps {
  params: {
    chefId: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const chef = mockChefs[params.chefId as keyof typeof mockChefs]

  if (!chef) {
    notFound()
  }

  return <BookingFlow chef={chef} />
}
