"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoCard } from "./video-card"

const mockVideos = [
  {
    id: "1",
    chef: {
      id: "1",
      name: "Marco Rodriguez",
      avatar: "/chef-portrait.png",
      cuisine: "Italian",
      rating: 4.9,
      verified: true,
      location: "New York, NY",
      priceRange: "$$$",
    },
    videoUrl: "/chef-cooking-pasta.png",
    title: "Homemade Truffle Pasta",
    description: "Learn the secrets of authentic Italian truffle pasta with fresh ingredients",
    likes: 1240,
    comments: 89,
    shares: 45,
    duration: 45,
    tags: ["Italian", "Pasta", "Truffle"],
    isBookmarked: false,
  },
  {
    id: "2",
    chef: {
      id: "2",
      name: "Sakura Tanaka",
      avatar: "/japanese-chef-portrait.png",
      cuisine: "Japanese",
      rating: 4.8,
      verified: true,
      location: "Los Angeles, CA",
      priceRange: "$$$$",
    },
    videoUrl: "/sushi-preparation.png",
    title: "Perfect Sushi Technique",
    description: "Master the art of sushi making with traditional Japanese methods",
    likes: 892,
    comments: 156,
    shares: 78,
    duration: 60,
    tags: ["Japanese", "Sushi", "Traditional"],
    isBookmarked: true,
  },
  {
    id: "3",
    chef: {
      id: "3",
      name: "Antoine Dubois",
      avatar: "/french-chef-portrait.png",
      cuisine: "French",
      rating: 4.9,
      verified: true,
      location: "San Francisco, CA",
      priceRange: "$$$$",
    },
    videoUrl: "/french-pastry-making.png",
    title: "Classic French Croissants",
    description: "The perfect flaky croissant technique revealed by a Michelin-starred chef",
    likes: 2156,
    comments: 234,
    shares: 123,
    duration: 90,
    tags: ["French", "Pastry", "Breakfast"],
    isBookmarked: false,
  },
  {
    id: "4",
    chef: {
      id: "4",
      name: "Maria Gonzalez",
      avatar: "/chef-portrait.png",
      cuisine: "Mexican",
      rating: 4.7,
      verified: true,
      location: "Austin, TX",
      priceRange: "$$",
    },
    videoUrl: "/chef-cooking-pasta.png",
    title: "Authentic Mole Poblano",
    description: "Traditional Mexican mole with 20+ ingredients, passed down through generations",
    likes: 1567,
    comments: 198,
    shares: 89,
    duration: 120,
    tags: ["Mexican", "Traditional", "Mole"],
    isBookmarked: false,
  },
  {
    id: "5",
    chef: {
      id: "5",
      name: "David Kim",
      avatar: "/japanese-chef-portrait.png",
      cuisine: "Korean",
      rating: 4.8,
      verified: true,
      location: "Seattle, WA",
      priceRange: "$$$",
    },
    videoUrl: "/sushi-preparation.png",
    title: "Korean BBQ Masterclass",
    description: "Perfect galbi and banchan preparation for an authentic Korean feast",
    likes: 934,
    comments: 112,
    shares: 67,
    duration: 75,
    tags: ["Korean", "BBQ", "Galbi"],
    isBookmarked: true,
  },
  {
    id: "6",
    chef: {
      id: "6",
      name: "Isabella Chen",
      avatar: "/french-chef-portrait.png",
      cuisine: "Fusion",
      rating: 4.9,
      verified: true,
      location: "Miami, FL",
      priceRange: "$$$",
    },
    videoUrl: "/french-pastry-making.png",
    title: "Asian-French Fusion",
    description: "Innovative fusion cuisine blending Asian flavors with French techniques",
    likes: 1876,
    comments: 267,
    shares: 134,
    duration: 85,
    tags: ["Fusion", "Asian", "French"],
    isBookmarked: false,
  },
  {
    id: "7",
    chef: {
      id: "7",
      name: "Ahmed Hassan",
      avatar: "/chef-portrait.png",
      cuisine: "Middle Eastern",
      rating: 4.8,
      verified: true,
      location: "Chicago, IL",
      priceRange: "$$",
    },
    videoUrl: "/sushi-preparation.png",
    title: "Perfect Shawarma",
    description: "Traditional Middle Eastern shawarma with homemade spices and sauces",
    likes: 1345,
    comments: 178,
    shares: 92,
    duration: 65,
    tags: ["Middle Eastern", "Shawarma", "Traditional"],
    isBookmarked: true,
  },
  {
    id: "8",
    chef: {
      id: "8",
      name: "Elena Rossi",
      avatar: "/japanese-chef-portrait.png",
      cuisine: "Mediterranean",
      rating: 4.7,
      verified: true,
      location: "Portland, OR",
      priceRange: "$$$",
    },
    videoUrl: "/chef-cooking-pasta.png",
    title: "Fresh Mediterranean Bowl",
    description: "Healthy Mediterranean cuisine with fresh herbs and olive oil",
    likes: 987,
    comments: 145,
    shares: 73,
    duration: 55,
    tags: ["Mediterranean", "Healthy", "Fresh"],
    isBookmarked: false,
  },
]

export function VideoFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [videos, setVideos] = useState(mockVideos)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return

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

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1
      if (nextIndex >= videos.length - 2) {
        const shuffledVideos = [...mockVideos].sort(() => Math.random() - 0.5)
        setVideos((prevVideos) => [...prevVideos, ...shuffledVideos])
      }
      return nextIndex
    })
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
  }, [currentIndex, isScrolling])

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

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-black"
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
            video={videos[currentIndex]}
            isActive={true}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={true}
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
