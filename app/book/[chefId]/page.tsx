import { BookingFlow } from "@/components/booking-flow"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

interface BookingPageProps {
  params: Promise<{
    chefId: string
  }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { chefId } = await params
  const supabase = await createClient()

  // Fetch chef data from Supabase
  const { data: chef, error } = await supabase
    .from("chefs")
    .select(`
      id,
      name,
      avatar_url,
      cuisines,
      rating,
      location,
      price_per_hour,
      is_available
    `)
    .eq("id", chefId)
    .single()

  if (error || !chef) {
    notFound()
  }

  // Transform data to match component interface
  const transformedChef = {
    id: chef.id,
    name: chef.name,
    avatar: chef.avatar_url || "/placeholder.svg",
    cuisine: chef.cuisines?.[0] || "Various",
    rating: chef.rating || 0,
    location: chef.location || "Location not specified",
    priceRange:
      chef.price_per_hour >= 150 ? "$$$$" : chef.price_per_hour >= 100 ? "$$$" : chef.price_per_hour >= 75 ? "$$" : "$",
    services: [
      {
        id: "dinner_party",
        name: "Private Dinner Party",
        description: "Intimate dining experience with personalized menu",
        price: chef.price_per_hour * 2,
        duration: "3-4 hours",
        minGuests: 2,
        maxGuests: 12,
      },
      {
        id: "cooking_class",
        name: "Cooking Class",
        description: "Learn culinary techniques hands-on with the chef",
        price: chef.price_per_hour,
        duration: "2-3 hours",
        minGuests: 1,
        maxGuests: 8,
      },
      {
        id: "meal_prep",
        name: "Meal Prep Service",
        description: "Weekly meal preparation for busy schedules",
        price: Math.floor(chef.price_per_hour * 0.6),
        duration: "Per meal",
        minGuests: 1,
        maxGuests: 4,
      },
      {
        id: "catering",
        name: "Catering Service",
        description: "Professional catering for events and gatherings",
        price: chef.price_per_hour * 1.5,
        duration: "4-6 hours",
        minGuests: 10,
        maxGuests: 50,
      },
    ],
    availability: {
      nextAvailable: chef.is_available ? "Available" : "Unavailable",
      timeSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
    },
  }

  return <BookingFlow chef={transformedChef} />
}