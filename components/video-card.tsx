"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share, Star, CheckCircle, Bookmark, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Chef {
  id: string
  name: string
  avatar: string
  cuisine: string
  rating: number
  verified: boolean
  location: string
  priceRange: string
}

interface Video {
  id: string
  chef: Chef
  videoUrl: string
  title: string
  description: string
  likes: number
  comments: number
  shares: number
  duration: number
  tags: string[]
  isBookmarked: boolean
}

interface VideoCardProps {
  video: Video
  isActive: boolean
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function VideoCard({ video, isActive, onNext, onPrevious, canGoNext, canGoPrevious }: VideoCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(video.isBookmarked)
  const [likes, setLikes] = useState(video.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  if (!isActive) return null

  return (
    <div className="absolute inset-0 bg-black">
      {/* Video Background */}
      <div className="relative h-full w-full">
        <img
          src={video.videoUrl || "/placeholder.svg?height=800&width=400&query=chef cooking video"}
          alt={video.title}
          className="h-full w-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex">
          <motion.button
            onClick={canGoPrevious ? onPrevious : undefined}
            className={cn("flex-1 opacity-0 active:bg-white/5", !canGoPrevious && "cursor-not-allowed")}
            whileTap={{ scale: 0.98 }}
            aria-label="Previous video"
          />
          <motion.button
            onClick={canGoNext ? onNext : undefined}
            className={cn("flex-1 opacity-0 active:bg-white/5", !canGoNext && "cursor-not-allowed")}
            whileTap={{ scale: 0.98 }}
            aria-label="Next video"
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-16 p-3 pb-20">
          <div className="space-y-2">
            {/* Chef Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Link href={`/chef/${video.chef.id}`} className="flex items-center gap-2 group">
                <Avatar className="h-8 w-8 border border-white/50 ring-1 ring-white/20">
                  <AvatarImage src={video.chef.avatar || "/placeholder.svg"} alt={video.chef.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {video.chef.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-white font-medium text-sm truncate drop-shadow-sm">{video.chef.name}</h3>
                    {video.chef.verified && <CheckCircle className="h-3 w-3 text-primary fill-current flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <span className="truncate">{video.chef.cuisine}</span>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star className="h-2.5 w-2.5 fill-current text-yellow-400" />
                      <span>{video.chef.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Video Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-white font-medium text-sm leading-tight drop-shadow-sm max-w-xs">{video.title}</h2>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-1"
            >
              {video.tags.slice(0, 3).map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <span className="text-white/60 text-xs">#{tag}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Booking Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Link href={`/book/${video.chef.id}`}>
                <Button
                  size="sm"
                  className="bg-white/90 hover:bg-white text-black font-medium rounded-full text-xs px-4 py-1.5 backdrop-blur-sm border border-white/20"
                >
                  Book Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute right-2 bottom-24 flex flex-col items-center gap-3"
        >
          <Link href={`/chef/${video.chef.id}`}>
            <motion.button className="flex flex-col items-center gap-0.5" whileTap={{ scale: 0.9 }}>
              <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm">
                <User className="h-5 w-5 text-white" />
              </div>
            </motion.button>
          </Link>

          <motion.button onClick={handleLike} className="flex flex-col items-center gap-0.5" whileTap={{ scale: 0.9 }}>
            <motion.div
              className={cn(
                "p-2 rounded-full backdrop-blur-sm transition-all duration-200",
                isLiked ? "bg-red-500" : "bg-black/40",
              )}
              animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={cn("h-5 w-5", isLiked ? "text-white fill-current" : "text-white")} />
            </motion.div>
            <span className="text-white text-xs font-medium drop-shadow-sm">
              {likes > 999 ? `${Math.floor(likes / 1000)}k` : likes}
            </span>
          </motion.button>

          <motion.button className="flex flex-col items-center gap-0.5" whileTap={{ scale: 0.9 }}>
            <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-white text-xs font-medium drop-shadow-sm">
              {video.comments > 999 ? `${Math.floor(video.comments / 1000)}k` : video.comments}
            </span>
          </motion.button>

          <motion.button
            onClick={handleBookmark}
            className="flex flex-col items-center gap-0.5"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={cn(
                "p-2 rounded-full backdrop-blur-sm transition-all duration-200",
                isBookmarked ? "bg-yellow-500" : "bg-black/40",
              )}
              animate={isBookmarked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Bookmark className={cn("h-5 w-5", isBookmarked ? "text-white fill-current" : "text-white")} />
            </motion.div>
          </motion.button>

          <motion.button className="flex flex-col items-center gap-0.5" whileTap={{ scale: 0.9 }}>
            <div className="p-2 rounded-full bg-black/40 backdrop-blur-sm">
              <Share className="h-5 w-5 text-white" />
            </div>
          </motion.button>
        </motion.div>

        {/* Duration Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute top-16 right-3"
        >
          <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm text-xs px-2 py-0.5">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
          </Badge>
        </motion.div>
      </div>
    </div>
  )
}
