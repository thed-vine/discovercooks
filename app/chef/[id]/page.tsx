import { ChefProfile } from "@/components/chef-profile"
import { notFound } from "next/navigation"

// Mock chef data - in a real app this would come from a database
const mockChefs = {
  "1": {
    id: "1",
    name: "Marco Rodriguez",
    avatar: "/chef-portrait.png",
    coverImage: "/chef-cooking-pasta.png",
    cuisine: "Italian",
    rating: 4.9,
    reviewCount: 247,
    verified: true,
    location: "New York, NY",
    priceRange: "$$$",
    experience: "15+ years",
    bio: "Born and raised in Naples, Italy, Chef Marco brings authentic Italian flavors to New York. Trained under Michelin-starred chefs in Rome and Milan, he specializes in handmade pasta and traditional Italian techniques passed down through generations.",
    specialties: ["Handmade Pasta", "Truffle Dishes", "Wine Pairing", "Traditional Italian"],
    languages: ["English", "Italian", "Spanish"],
    certifications: ["Culinary Institute of America", "Italian Culinary Federation"],
    availability: {
      nextAvailable: "Tomorrow",
      weeklySlots: 12,
      responseTime: "Within 2 hours",
    },
    pricing: {
      dinnerParty: 150,
      cookingClass: 75,
      mealPrep: 45,
    },
    videos: [
      {
        id: "1",
        title: "Homemade Truffle Pasta",
        thumbnail: "/chef-cooking-pasta.png",
        duration: 45,
        likes: 1240,
        views: 15600,
      },
      {
        id: "2",
        title: "Perfect Risotto Technique",
        thumbnail: "/chef-cooking-pasta.png",
        duration: 38,
        likes: 892,
        views: 12300,
      },
      {
        id: "3",
        title: "Italian Wine Pairing",
        thumbnail: "/chef-cooking-pasta.png",
        duration: 25,
        likes: 567,
        views: 8900,
      },
      {
        id: "4",
        title: "Fresh Mozzarella Making",
        thumbnail: "/chef-cooking-pasta.png",
        duration: 52,
        likes: 1456,
        views: 18700,
      },
    ],
    reviews: [
      {
        id: "1",
        user: "Sarah M.",
        avatar: "/chef-portrait.png",
        rating: 5,
        date: "2 days ago",
        comment:
          "Marco created an incredible Italian feast for our anniversary dinner. The truffle pasta was absolutely divine!",
      },
      {
        id: "2",
        user: "James L.",
        avatar: "/japanese-chef-portrait.png",
        rating: 5,
        date: "1 week ago",
        comment:
          "Best cooking class I've ever taken. Marco's passion for Italian cuisine is infectious and his techniques are flawless.",
      },
      {
        id: "3",
        user: "Emily R.",
        avatar: "/french-chef-portrait.png",
        rating: 4,
        date: "2 weeks ago",
        comment: "Amazing meal prep service. Marco's dishes kept us eating well all week. Highly recommend!",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Sakura Tanaka",
    avatar: "/japanese-chef-portrait.png",
    coverImage: "/sushi-preparation.png",
    cuisine: "Japanese",
    rating: 4.8,
    reviewCount: 189,
    verified: true,
    location: "Los Angeles, CA",
    priceRange: "$$$$",
    experience: "12+ years",
    bio: "Master sushi chef trained in Tokyo's prestigious Tsukiji market. Sakura combines traditional Japanese techniques with California's fresh ingredients to create unforgettable omakase experiences.",
    specialties: ["Sushi & Sashimi", "Omakase", "Japanese Kaiseki", "Sake Pairing"],
    languages: ["English", "Japanese"],
    certifications: ["Tokyo Sushi Academy", "Japan Culinary Institute"],
    availability: {
      nextAvailable: "This weekend",
      weeklySlots: 8,
      responseTime: "Within 4 hours",
    },
    pricing: {
      dinnerParty: 200,
      cookingClass: 95,
      mealPrep: 65,
    },
    videos: [
      {
        id: "1",
        title: "Perfect Sushi Technique",
        thumbnail: "/sushi-preparation.png",
        duration: 60,
        likes: 892,
        views: 23400,
      },
    ],
    reviews: [
      {
        id: "1",
        user: "Michael K.",
        avatar: "/chef-portrait.png",
        rating: 5,
        date: "3 days ago",
        comment: "Sakura's omakase experience was transcendent. Every piece of sushi was perfection.",
      },
    ],
  },
}

interface ChefPageProps {
  params: {
    id: string
  }
}

export default function ChefPage({ params }: ChefPageProps) {
  const chef = mockChefs[params.id as keyof typeof mockChefs]

  if (!chef) {
    notFound()
  }

  return <ChefProfile chef={chef} />
}
