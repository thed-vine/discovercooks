"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, MapPin, Star, ChefHat, Clock, Heart, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock chef data for search
const mockChefs = [
  {
    id: "1",
    name: "Marco Rodriguez",
    avatar: "/chef-portrait.png",
    coverImage: "/chef-cooking-pasta.png",
    cuisine: "Italian",
    rating: 4.9,
    reviewCount: 247,
    verified: true,
    location: "New York, NY",
    city: "New York",
    state: "NY",
    priceRange: "$$$",
    priceValue: 150,
    experience: "15+ years",
    specialties: ["Handmade Pasta", "Truffle Dishes", "Wine Pairing"],
    availability: "Available today",
    responseTime: "2 hours",
    tags: ["Italian", "Pasta", "Fine Dining", "Wine Expert"],
  },
  {
    id: "2",
    name: "Sakura Tanaka",
    avatar: "/japanese-chef-portrait.png",
    coverImage: "/sushi-preparation.png",
    cuisine: "Japanese",
    rating: 4.8,
    reviewCount: 189,
    verified: true,
    location: "Los Angeles, CA",
    city: "Los Angeles",
    state: "CA",
    priceRange: "$$$$",
    priceValue: 200,
    experience: "12+ years",
    specialties: ["Sushi & Sashimi", "Omakase", "Kaiseki"],
    availability: "Available this weekend",
    responseTime: "4 hours",
    tags: ["Japanese", "Sushi", "Traditional", "Omakase"],
  },
  {
    id: "3",
    name: "Antoine Dubois",
    avatar: "/french-chef-portrait.png",
    coverImage: "/french-pastry-making.png",
    cuisine: "French",
    rating: 4.9,
    reviewCount: 312,
    verified: true,
    location: "San Francisco, CA",
    city: "San Francisco",
    state: "CA",
    priceRange: "$$$$",
    priceValue: 180,
    experience: "18+ years",
    specialties: ["French Pastry", "Fine Dining", "Michelin Techniques"],
    availability: "Available tomorrow",
    responseTime: "1 hour",
    tags: ["French", "Pastry", "Fine Dining", "Michelin"],
  },
  {
    id: "4",
    name: "Maria Gonzalez",
    avatar: "/chef-portrait.png",
    coverImage: "/chef-cooking-pasta.png",
    cuisine: "Mexican",
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    location: "Austin, TX",
    city: "Austin",
    state: "TX",
    priceRange: "$$",
    priceValue: 85,
    experience: "10+ years",
    specialties: ["Traditional Mexican", "Mole", "Street Food"],
    availability: "Available next week",
    responseTime: "3 hours",
    tags: ["Mexican", "Traditional", "Authentic", "Spicy"],
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "/japanese-chef-portrait.png",
    coverImage: "/sushi-preparation.png",
    cuisine: "Korean",
    rating: 4.8,
    reviewCount: 203,
    verified: true,
    location: "Seattle, WA",
    city: "Seattle",
    state: "WA",
    priceRange: "$$$",
    priceValue: 120,
    experience: "14+ years",
    specialties: ["Korean BBQ", "Banchan", "Fermentation"],
    availability: "Available today",
    responseTime: "2 hours",
    tags: ["Korean", "BBQ", "Fermented", "Authentic"],
  },
  {
    id: "6",
    name: "Isabella Romano",
    avatar: "/french-chef-portrait.png",
    coverImage: "/french-pastry-making.png",
    cuisine: "Mediterranean",
    rating: 4.6,
    reviewCount: 134,
    verified: false,
    location: "Miami, FL",
    city: "Miami",
    state: "FL",
    priceRange: "$$",
    priceValue: 95,
    experience: "8+ years",
    specialties: ["Mediterranean", "Seafood", "Healthy Cuisine"],
    availability: "Available this weekend",
    responseTime: "5 hours",
    tags: ["Mediterranean", "Seafood", "Healthy", "Fresh"],
  },
]

const cuisineTypes = [
  "Italian",
  "Japanese",
  "French",
  "Mexican",
  "Korean",
  "Mediterranean",
  "American",
  "Indian",
  "Thai",
  "Chinese",
]
const priceRanges = [
  { label: "$", value: "budget", min: 0, max: 75 },
  { label: "$$", value: "moderate", min: 75, max: 125 },
  { label: "$$$", value: "expensive", min: 125, max: 175 },
  { label: "$$$$", value: "luxury", min: 175, max: 300 },
]

interface Filters {
  cuisines: string[]
  priceRange: [number, number]
  rating: number
  location: string
  availability: string
  verified: boolean
}

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    cuisines: [],
    priceRange: [0, 300],
    rating: 0,
    location: "",
    availability: "",
    verified: false,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Generate search suggestions
  const allSuggestions = useMemo(() => {
    const chefNames = mockChefs.map((chef) => chef.name)
    const cuisines = [...new Set(mockChefs.map((chef) => chef.cuisine))]
    const cities = [...new Set(mockChefs.map((chef) => chef.city))]
    const specialties = [...new Set(mockChefs.flatMap((chef) => chef.specialties))]
    const tags = [...new Set(mockChefs.flatMap((chef) => chef.tags))]

    return [...chefNames, ...cuisines, ...cities, ...specialties, ...tags]
  }, [])

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = allSuggestions
        .filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 6)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery, allSuggestions])

  // Filter chefs based on search and filters
  const filteredChefs = useMemo(() => {
    return mockChefs.filter((chef) => {
      // Text search
      const matchesSearch =
        searchQuery === "" ||
        chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
        chef.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Cuisine filter
      const matchesCuisine = filters.cuisines.length === 0 || filters.cuisines.includes(chef.cuisine)

      // Price range filter
      const matchesPrice = chef.priceValue >= filters.priceRange[0] && chef.priceValue <= filters.priceRange[1]

      // Rating filter
      const matchesRating = chef.rating >= filters.rating

      // Location filter
      const matchesLocation =
        filters.location === "" || chef.location.toLowerCase().includes(filters.location.toLowerCase())

      // Verified filter
      const matchesVerified = !filters.verified || chef.verified

      return matchesSearch && matchesCuisine && matchesPrice && matchesRating && matchesLocation && matchesVerified
    })
  }, [searchQuery, filters])

  const handleCuisineToggle = (cuisine: string) => {
    setFilters((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }))
  }

  const clearFilters = () => {
    setFilters({
      cuisines: [],
      priceRange: [0, 300],
      rating: 0,
      location: "",
      availability: "",
      verified: false,
    })
  }

  const activeFilterCount =
    filters.cuisines.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 300 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.verified ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search chefs, cuisines, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-50 overflow-hidden"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-white border-gray-200 rounded-xl whitespace-nowrap"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
                <SheetHeader className="pb-4">
                  <SheetTitle className="text-xl">Filter Chefs</SheetTitle>
                </SheetHeader>

                <div className="py-2 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                  {/* Cuisine Types */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Cuisine Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {cuisineTypes.map((cuisine) => (
                        <Badge
                          key={cuisine}
                          variant={filters.cuisines.includes(cuisine) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-all duration-200 px-4 py-2 rounded-full text-sm",
                            filters.cuisines.includes(cuisine)
                              ? "bg-primary text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                          )}
                          onClick={() => handleCuisineToggle(cuisine)}
                        >
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-4 text-gray-900">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                        }
                        max={300}
                        min={0}
                        step={25}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="font-medium">${filters.priceRange[0]}</span>
                        <span className="font-medium">${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Minimum Rating</h3>
                    <RadioGroup
                      value={filters.rating.toString()}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: Number.parseFloat(value) }))}
                      className="space-y-3"
                    >
                      {[4.5, 4.0, 3.5, 0].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                          <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                          <Label htmlFor={`rating-${rating}`} className="flex items-center gap-2 cursor-pointer">
                            {rating > 0 ? (
                              <>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  <span className="font-medium">{rating}+</span>
                                </div>
                              </>
                            ) : (
                              <span className="font-medium">Any rating</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900">Location</h3>
                    <Input
                      placeholder="Enter city or state..."
                      value={filters.location}
                      onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                      className="bg-gray-50 border-gray-200 rounded-xl"
                    />
                  </div>

                  {/* Verified Chefs */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Checkbox
                      id="verified"
                      checked={filters.verified}
                      onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, verified: checked as boolean }))}
                    />
                    <Label htmlFor="verified" className="font-medium cursor-pointer">
                      Verified chefs only
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1 bg-white border-gray-200 rounded-xl"
                  >
                    Clear All
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="flex-1 bg-primary text-white rounded-xl">
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto">
                {filters.cuisines.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    className="flex items-center gap-1 whitespace-nowrap bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1"
                  >
                    {cuisine}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-primary/70"
                      onClick={() => handleCuisineToggle(cuisine)}
                    />
                  </Badge>
                ))}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 300) && (
                  <Badge className="flex items-center gap-1 whitespace-nowrap bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1">
                    ${filters.priceRange[0]}-${filters.priceRange[1]}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-primary/70"
                      onClick={() => setFilters((prev) => ({ ...prev, priceRange: [0, 300] }))}
                    />
                  </Badge>
                )}
                {filters.rating > 0 && (
                  <Badge className="flex items-center gap-1 whitespace-nowrap bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1">
                    {filters.rating}+ stars
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-primary/70"
                      onClick={() => setFilters((prev) => ({ ...prev, rating: 0 }))}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredChefs.length} chef{filteredChefs.length !== 1 ? "s" : ""} found
          </h2>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear search
            </Button>
          )}
        </div>

        {/* Chef Results */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredChefs.map((chef, index) => (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/chef/${chef.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      {/* Cover Image Section */}
                      <div className="relative h-24 sm:h-32 bg-gradient-to-r from-primary/10 to-primary/5">
                        <img
                          src={chef.coverImage || "/placeholder.svg?height=128&width=400&query=chef cooking"}
                          alt={`${chef.name} cooking`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-white/80 hover:bg-white rounded-full"
                          >
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-3 sm:p-4">
                        <div className="flex gap-3 sm:gap-4">
                          {/* Chef Avatar */}
                          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 border-4 border-white -mt-6 sm:-mt-8 relative z-10 shadow-sm">
                            <AvatarImage src={chef.avatar || "/placeholder.svg"} alt={chef.name} />
                            <AvatarFallback className="bg-primary text-white font-semibold text-sm sm:text-base">
                              {chef.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          {/* Chef Info */}
                          <div className="flex-1 min-w-0 pt-1 sm:pt-2">
                            <div className="flex items-start justify-between mb-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{chef.name}</h3>
                                  {chef.verified && (
                                    <Badge className="bg-green-100 text-green-800 text-xs px-1.5 sm:px-2 py-0.5 rounded-full border-0 flex-shrink-0">
                                      ✓
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">
                                  {chef.cuisine} • {chef.experience}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                                  <span className="font-bold text-gray-900 text-sm sm:text-base">{chef.rating}</span>
                                  <span className="text-gray-500 text-xs sm:text-sm">({chef.reviewCount})</span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs font-semibold border-gray-200 text-gray-700"
                                >
                                  {chef.priceRange}
                                </Badge>
                              </div>
                            </div>

                            {/* Specialties */}
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                              {chef.specialties.slice(0, window.innerWidth < 640 ? 2 : 3).map((specialty) => (
                                <Badge
                                  key={specialty}
                                  className="text-xs bg-gray-100 text-gray-700 border-0 rounded-full px-2 py-1"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            </div>

                            {/* Location and Availability */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-1 sm:gap-0">
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                <span className="font-medium truncate">{chef.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-green-600">
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                <span className="font-medium">{chef.availability}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                              <Button
                                size="sm"
                                className="flex-1 bg-primary text-white rounded-xl font-medium text-xs sm:text-sm"
                              >
                                Book Now
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="px-2 sm:px-3 border-gray-200 rounded-xl bg-transparent"
                              >
                                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* No Results */}
          {filteredChefs.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No chefs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters to find more chefs.</p>
                <Button onClick={clearFilters} className="bg-primary text-white rounded-xl px-6">
                  Clear all filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
