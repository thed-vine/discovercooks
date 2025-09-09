"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Star, Share, Heart, Play, Eye, CheckCircle, Award, Globe, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Chef {
  id: string
  name: string
  avatar: string
  coverImage: string
  cuisine: string
  rating: number
  reviewCount: number
  verified: boolean
  location: string
  priceRange: string
  experience: string
  bio: string
  specialties: string[]
  languages: string[]
  certifications: string[]
  availability: {
    nextAvailable: string
    weeklySlots: number
    responseTime: string
  }
  pricing: {
    dinnerParty: number
    cookingClass: number
    mealPrep: number
  }
  videos: Array<{
    id: string
    title: string
    thumbnail: string
    duration: number
    likes: number
    views: number
  }>
  reviews: Array<{
    id: string
    user: string
    avatar: string
    rating: number
    date: string
    comment: string
  }>
}

interface ChefProfileProps {
  chef: Chef
}

export function ChefProfile({ chef }: ChefProfileProps) {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)

  const handleBack = () => {
    router.back()
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Cover Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={chef.coverImage || "/placeholder.svg?height=300&width=400&query=chef cooking"}
          alt={`${chef.name} cooking`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm">
              <Share className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chef Avatar and Basic Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end gap-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={chef.avatar || "/placeholder.svg"} alt={chef.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {chef.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-white font-bold text-2xl truncate">{chef.name}</h1>
                {chef.verified && <CheckCircle className="h-5 w-5 text-primary fill-current flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <span>{chef.cuisine}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span>{chef.rating}</span>
                  <span>({chef.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-3">
          <Link href={`/book/${chef.id}`} className="flex-1">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 font-semibold">
              Book Now
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={handleFollow}
            className={cn("px-6", isFollowing && "bg-secondary text-secondary-foreground border-secondary")}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button variant="outline" size="lg" className="px-6 bg-transparent">
            Message
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">{chef.videos.length}</div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{chef.availability.weeklySlots}</div>
            <div className="text-sm text-muted-foreground">Weekly Slots</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{chef.experience}</div>
            <div className="text-sm text-muted-foreground">Experience</div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="about" className="flex-1">
        <TabsList className="w-full justify-start px-4 bg-transparent border-b rounded-none h-12">
          <TabsTrigger
            value="about"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Videos
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="p-4 space-y-6 mt-0">
          {/* Bio */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">About Chef {chef.name.split(" ")[0]}</h3>
              <p className="text-muted-foreground leading-relaxed">{chef.bio}</p>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {chef.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="bg-primary/10 text-primary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Availability
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Available:</span>
                    <span className="font-medium">{chef.availability.nextAvailable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span className="font-medium">{chef.availability.responseTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">Pricing</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dinner Party:</span>
                    <span className="font-medium">${chef.pricing.dinnerParty}/person</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cooking Class:</span>
                    <span className="font-medium">${chef.pricing.cookingClass}/person</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meal Prep:</span>
                    <span className="font-medium">${chef.pricing.mealPrep}/meal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {chef.languages.map((language) => (
                    <Badge key={language} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications
                </h3>
                <div className="space-y-1">
                  {chef.certifications.map((cert) => (
                    <div key={cert} className="text-sm text-muted-foreground">
                      {cert}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="p-4 mt-0">
          <div className="grid grid-cols-2 gap-3">
            {chef.videos.map((video) => (
              <motion.div
                key={video.id}
                whileTap={{ scale: 0.95 }}
                className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted cursor-pointer"
              >
                <img
                  src={video.thumbnail || "/placeholder.svg?height=300&width=200&query=cooking video"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Play className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>

                {/* Video Info */}
                <div className="absolute bottom-2 left-2 right-2">
                  <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{video.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{video.views}</span>
                      </div>
                    </div>
                    <span>{video.duration}s</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-4 mt-0">
          <div className="space-y-4">
            {chef.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                      <AvatarFallback>
                        {review.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex items-center">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
