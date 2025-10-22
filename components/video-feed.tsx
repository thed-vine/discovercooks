"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoCard } from "./video-card"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface Chef {
  id: string
  name: string
  avatar_url: string | null
  cuisines: string[]
  rating: number
  is_verified: boolean
  location: string | null
  price_per_hour: number
}

interface Video {
  id: string
  title: string
  description: string | null
  video_url: string
  videoUrl: string
  thumbnail_url: string | null
  duration: number | null
  tags: string[]
  likes_count: number
  likes: number
  comments?: number
  shares?: number
  isBookmarked?: boolean
  views_count: number
  chef: Chef
}

export function VideoFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const supabase = createClient()

  const fetchVideos = async (offset = 0, limit = 10): Promise<Video[]> => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          duration,
          tags,
          likes_count,
          views_count,
          comments_count,
          shares_count,
          chef:chefs(
            id,
            name,
            avatar_url,
            cuisines,
            rating,
            is_verified,
            location,
            price_per_hour
          )
        `)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error("Supabase error fetching videos:", error)
        setError("Failed to load videos")
        return []
      }

      if (!data || data.length === 0) return []

      // Normalize rows: Supabase join returns chef as array; convert to object and map snake_case to expected fields.
      const normalized: Video[] = (data as any[]).map((v: any) => {
        const chefRaw = Array.isArray(v.chef) ? v.chef[0] : v.chef
        const chef: Chef = {
          id: chefRaw?.id ?? "",
          name: chefRaw?.name ?? "",
          avatar_url: chefRaw?.avatar_url ?? null,
          cuisines: chefRaw?.cuisines ?? [],
          rating: chefRaw?.rating ?? 0,
          is_verified: !!chefRaw?.is_verified,
          location: chefRaw?.location ?? null,
          price_per_hour: chefRaw?.price_per_hour ?? 0,
        }

        return {
          id: v.id,
          title: v.title,
          description: v.description ?? null,
          video_url: v.video_url ?? v.videoUrl ?? "",
          videoUrl: v.video_url ?? v.videoUrl ?? "",
          thumbnail_url: v.thumbnail_url ?? null,
          duration: v.duration ?? null,
          tags: v.tags ?? [],
          likes_count: v.likes_count ?? 0,
          likes: v.likes_count ?? 0,
          comments: v.comments_count ?? 0,
          shares: v.shares_count ?? 0,
          isBookmarked: false,
          views_count: v.views_count ?? 0,
          chef,
        } as Video
      })

      return normalized
    } catch (err) {
      console.error("Error fetching videos:", err)
      setError("Failed to load videos")
      return []
    }
  }

  useEffect(() => {
    const loadInitialVideos = async () => {
      setLoading(true)
      const initialVideos = await fetchVideos(0, 10)
      setVideos(initialVideos)
      setLoading(false)
    }

    loadInitialVideos()
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0]?.clientY ?? 0
  }

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) {
      touchStartY.current = 0
      touchEndY.current = 0
      return
    }

    const distance = touchStartY.current - touchEndY.current
    const isSignificantSwipe = Math.abs(distance) > 50

    if (isSignificantSwipe && !isScrolling) {
      setIsScrolling(true)
      if (distance > 0) {
        // Swipe up - next video
        handleNext()
      } else {
        // Swipe down - previous video
        handlePrevious()
      }

      setTimeout(() => setIsScrolling(false), 500)
    }

    touchStartY.current = 0
    touchEndY.current = 0
  }

  const handleNext = async () => {
    setDirection(1)
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1
      // Load more videos when approaching the end
      if (nextIndex >= videos.length - 2) {
        loadMoreVideos()
      }
      return nextIndex
    })
  }

  const loadMoreVideos = async () => {
    const moreVideos = await fetchVideos(videos.length, 10)
    if (moreVideos.length > 0) {
      setVideos((prevVideos) => [...prevVideos, ...moreVideos])
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((prev) => prev - 1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && !isScrolling) {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === "ArrowDown" && !isScrolling) {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isScrolling, videos.length])

  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (error || videos.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white text-center p-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">No videos available</h2>
          <p className="text-gray-400">Check back later for new chef content!</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 h-screen w-screen overflow-hidden bg-black touch-none"
      style={{ maxHeight: "100dvh", minHeight: "100dvh", height: "100dvh" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <VideoCard
            video={videos[currentIndex] as any}
            isActive={true}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={currentIndex < videos.length - 1}
            canGoPrevious={currentIndex > 0}
          />
        </motion.div>
      </AnimatePresence>

      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">Swipe up for next chef</div>
        </motion.div>
      )}
    </div>
  )
}