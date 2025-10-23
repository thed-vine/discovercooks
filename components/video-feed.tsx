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
  video_path: string
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

type VideoWithUrl = Video & { publicUrl: string }

export function VideoFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [videos, setVideos] = useState<VideoWithUrl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const supabase = createClient()
  const isPrivateBucket = true // set to false if bucket is public

  // helper to build playback URL (use signed URL for private buckets)
  async function buildPlaybackUrl(path: string) {
    if (!path) return ""
    if (!isPrivateBucket) {
      const { data } = supabase.storage.from("videos").getPublicUrl(path)
      return data?.publicUrl || ""
    }
    // createSignedUrl returns { publicURL } in older clients; handle response shape
    const expireSeconds = 60 * 60 // 1 hour
    const { data, error } = await supabase.storage.from("videos").createSignedUrl(path, expireSeconds)
    if (error) {
      console.error("createSignedUrl error", error)
      return ""
    }
    return (data as any)?.signedURL || (data as any)?.publicURL || ""
  }

  const fetchVideos = async (offset = 0, limit = 10): Promise<VideoWithUrl[]> => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          video_path,
          thumbnail_url,
          duration,
          tags,
          likes_count,
          views_count,
          chef:chefs (
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
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching videos:", error)
        return []
      }

      // Build video URLs in parallel
      const videosWithUrls = await Promise.all((data || []).map(async (video: any) => {
        const publicUrl = await buildPlaybackUrl(video.video_path)
        
        return {
          id: video.id,
          title: video.title || "",
          description: video.description || "",
          video_path: video.video_path,
          videoUrl: publicUrl, // This is the playback URL
          thumbnail_url: video.thumbnail_url,
          duration: video.duration || 0,
          tags: video.tags || [],
          likes_count: video.likes_count || 0,
          likes: video.likes_count || 0,
          comments: 0, // Add if you have comments count
          shares: 0,
          views_count: video.views_count || 0,
          chef: {
            id: video.chef?.id || "",
            name: video.chef?.name || "",
            avatar_url: video.chef?.avatar_url || null,
            cuisines: video.chef?.cuisines || [],
            rating: video.chef?.rating || 0,
            is_verified: !!video.chef?.is_verified,
            location: video.chef?.location || null,
            price_per_hour: video.chef?.price_per_hour || 0
          }
        } as VideoWithUrl
      }))

      return videosWithUrls
    } catch (err) {
      console.error("Error in fetchVideos:", err)
      return []
    }
  }

  // realtime subscriptions for likes/comments to keep feed in sync
  useEffect(() => {
    const likesSub = supabase
    .channel("public:likes")
    .on("postgres_changes", { event: "*", schema: "public", table: "likes" }, (payload) => {
      const { new: newRow, old: oldRow } = payload
      if (!newRow && !oldRow) return
      // update local likes_count for affected video id
      const videoId = ((newRow || oldRow) as any)['video_id']
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, likes_count: ((v.likes_count || 0) + (newRow ? 1 : -1)) } : v))
      )
    })
      .subscribe()
  
    const commentsSub = supabase
      .channel("public:comments")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, (payload) => {
        const { new: newRow } = payload
        if (!newRow || !('video_id' in newRow)) return
        const videoId = newRow.video_id
        setVideos((prev) => prev.map((v) => (v.id === videoId ? { ...v, comments: (v.comments || 0) + 1 } : v)))
      })
      .subscribe()
  
    return () => {
      supabase.removeChannel(likesSub)
      supabase.removeChannel(commentsSub)
    }
  }, [])

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
    const moreVideos = await fetchVideos(videos.length, 10) as VideoWithUrl[]
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

  // Prefetch next video when current index changes
  useEffect(() => {
    if (currentIndex < videos.length - 2) {
      // Prefetch next video URL
      const nextVideo = videos[currentIndex + 1]
      if (nextVideo && !nextVideo.videoUrl) {
        buildPlaybackUrl(nextVideo.video_path).then(url => {
          setVideos(prev => 
            prev.map((v, i) => i === currentIndex + 1 ? { ...v, videoUrl: url } : v)
          )
        })
      }
    }

    // Load more videos when approaching the end
    if (currentIndex >= videos.length - 2) {
      loadMoreVideos()
    }
  }, [currentIndex, videos.length])

  // Handle initial video load and autoplay
  useEffect(() => {
    if (videos.length === 0) {
      const loadInitialVideos = async () => {
        setLoading(true)
        try {
          const initialVideos = await fetchVideos(0, 5) // Start with 5 videos
          setVideos(initialVideos)
        } catch (err) {
          console.error("Failed to load initial videos:", err)
          setError("Failed to load videos")
        } finally {
          setLoading(false)
        }
      }

      loadInitialVideos()
    }
  }, [])

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
      className="fixed  h-fill w-[432px] overflow-hidden bg-black touch-none"
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