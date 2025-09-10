"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share, Star, CheckCircle, Bookmark, User, Play, Pause } from "lucide-react"
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [showHeart, setShowHeart] = useState(false)
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastTapRef = useRef(0)
  const touchStartYRef = useRef(0)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-hide play button after delay
  useEffect(() => {
    if (isPlaying && !isHovering) {
      // Clear any existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      
      // Set new timeout to hide play button
      hideTimeoutRef.current = setTimeout(() => {
        setShowPlayButton(false)
      }, 2000) // Hide after 2 seconds
    } else {
      // Show play button when paused or hovering
      setShowPlayButton(true)
      
      // Clear timeout if it exists
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [isPlaying, isHovering])

  // Reset showPlayButton when video becomes inactive
  useEffect(() => {
    if (!isActive) {
      setShowPlayButton(true)
    }
  }, [isActive])

  // Double-tap detection logic
  const handleTouchStart = (e: React.TouchEvent) => {
    const now = Date.now()
    const touch = e.touches[0]
    
    // Check if this is a double tap (within 300ms of last tap)
    if (now - lastTapRef.current < 300) {
      // Double tap detected - show heart animation and like
      setHeartPosition({ x: touch.clientX, y: touch.clientY })
      setShowHeart(true)
      handleLike()
      
      // Hide heart after animation
      setTimeout(() => setShowHeart(false), 800)
      
      // Reset tap timer
      lastTapRef.current = 0
    } else {
      // First tap - record time and position
      lastTapRef.current = now
      touchStartYRef.current = touch.clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // If user is scrolling, cancel double-tap detection
    const touch = e.touches[0]
    if (Math.abs(touch.clientY - touchStartYRef.current) > 10) {
      lastTapRef.current = 0
    }
  }

  const handleTouchEnd = () => {
    // Clear double-tap detection after timeout
    setTimeout(() => {
      if (lastTapRef.current > 0) {
        lastTapRef.current = 0
      }
    }, 300)
  }

  // Handle video play/pause based on isActive prop
  useEffect(() => {
    if (!videoRef.current) return

    if (isActive) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        videoRef.current?.play().catch(error => {
          console.log("Auto-play prevented:", error)
          setShowPlayButton(true)
        })
      }, 300)
      
      return () => clearTimeout(timer)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
      setShowPlayButton(true)
    }
  }, [isActive])

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
      
      // Show play button briefly before auto-hiding
      setShowPlayButton(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
      setShowPlayButton(true)
    }
  }

  const handleVideoClick = () => {
    handlePlayPause()
    
    // Show play button briefly when toggling play state
    setShowPlayButton(true)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  // Handle mouse enter/leave for desktop
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Add event listeners for video events
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handlePlay = () => {
      setIsPlaying(true)
      // Show play button briefly when video starts playing
      setShowPlayButton(true)
    }
    
    const handlePause = () => {
      setIsPlaying(false)
      setShowPlayButton(true)
    }
    
    const handleEnded = () => {
      setIsPlaying(false)
      setShowPlayButton(true)
    }

    videoElement.addEventListener('play', handlePlay)
    videoElement.addEventListener('pause', handlePause)
    videoElement.addEventListener('ended', handleEnded)

    return () => {
      videoElement.removeEventListener('play', handlePlay)
      videoElement.removeEventListener('pause', handlePause)
      videoElement.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Heart animation component
  const HeartAnimation = () => (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{ 
        left: heartPosition.x - 40, 
        top: heartPosition.y - 40,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0]
      }}
      transition={{ duration: 0.8 }}
    >
      <Heart className="w-20 h-20 text-red-500 fill-current" />
    </motion.div>
  )

  if (!isActive) return null

  return (
    <div className="absolute inset-0 bg-black">
      {/* Video Background */}
      <div 
        className="relative h-full w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={video.videoUrl || "/placeholder-video.mp4"}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          poster="/video-poster.jpg"
          onClick={handleVideoClick}
        />

        {/* Double-tap area */}
        <div 
          className="absolute inset-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Heart animation */}
          {showHeart && <HeartAnimation />}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play/Pause Overlay Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: showPlayButton ? 1 : 0,
            scale: showPlayButton ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/30"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          style={{ pointerEvents: showPlayButton ? 'auto' : 'none' }}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </div>
        </motion.button>

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