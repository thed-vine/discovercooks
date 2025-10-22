import { ChefProfile } from "@/components/chef-profile"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

interface ChefPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ChefPage({ params }: ChefPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch chef data with related videos and reviews
  const { data: chef, error } = await supabase
    .from("chefs")
    .select(`
      id,
      name,
      bio,
      avatar_url,
      cover_image_url,
      location,
      phone,
      email,
      specialties,
      cuisines,
      price_per_hour,
      rating,
      total_reviews,
      years_experience,
      is_verified,
      is_available,
      videos:videos(
        id,
        title,
        thumbnail_url,
        duration,
        likes_count,
        views_count
      )
    `)
    .eq("id", id)
    .single()

  if (error || !chef) {
    notFound()
  }

  // Fetch reviews for this chef
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      user_id,
      profiles:user_id(
        full_name,
        avatar_url
      )
    `)
    .eq("chef_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Transform data to match component interface
  const transformedChef = {
    id: chef.id,
    name: chef.name,
    avatar: chef.avatar_url || "/placeholder.svg",
    coverImage: chef.cover_image_url || "/chef-cooking.png",
    cuisine: chef.cuisines?.[0] || "Various",
    rating: chef.rating || 0,
    reviewCount: chef.total_reviews || 0,
    verified: chef.is_verified,
    location: chef.location || "Location not specified",
    priceRange:
      chef.price_per_hour >= 100 ? "$$$$" : chef.price_per_hour >= 75 ? "$$$" : chef.price_per_hour >= 50 ? "$$" : "$",
    experience: `${chef.years_experience || 0}+ years`,
    bio: chef.bio || "No bio available",
    specialties: chef.specialties || [],
    languages: ["English"], // Default for now
    certifications: ["Professional Chef"], // Default for now
    availability: {
      nextAvailable: chef.is_available ? "Available" : "Unavailable",
      weeklySlots: Math.floor(Math.random() * 15) + 5, // Mock data for now
      responseTime: "Within 4 hours",
    },
    pricing: {
      dinnerParty: chef.price_per_hour * 2,
      cookingClass: chef.price_per_hour,
      mealPrep: Math.floor(chef.price_per_hour * 0.6),
    },
    videos:
      chef.videos?.map((video: any) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail_url || "/cooking-video-scene.png",
        duration: video.duration || 60,
        likes: video.likes_count || 0,
        views: video.views_count || 0,
      })) || [],
    reviews:
      reviews?.map((review: any) => ({
        id: review.id,
        user: review.profiles?.full_name || "Anonymous User",
        avatar: review.profiles?.avatar_url || "/placeholder.svg",
        rating: review.rating,
        date: new Date(review.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        comment: review.comment || "",
      })) || [],
  }

  return <ChefProfile chef={transformedChef} />
}