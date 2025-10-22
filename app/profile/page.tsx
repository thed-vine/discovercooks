"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  User,
  Settings,
  Heart,
  Bell,
  CreditCard,
  MapPin,
  Edit3,
  Star,
  ChefHat,
  Calendar,
  Shield,
  HelpCircle,
  LogOut,
  Loader2,
} from "lucide-react"

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  phone: string | null
  created_at: string
}

interface FavoriteChef {
  id: string
  chef: {
    id: string
    name: string
    avatar_url: string | null
    cuisines: string[]
    rating: number
  }
}

interface UserBooking {
  id: string
  service_type: string
  event_date: string
  status: string
  chef: {
    name: string
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [favorites, setFavorites] = useState<FavoriteChef[]>([])
  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    newChefs: false,
    promotions: true,
    reminders: true,
  })

  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError)
      } else {
        setProfile(profileData)
      }

      // Fetch favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from("favorites")
        .select(`
          id,
          chef:chefs(
            id,
            name,
            avatar_url,
            cuisines,
            rating
          )
        `)
        .eq("user_id", user.id)

      if (favoritesError) {
        console.error("Error fetching favorites:", favoritesError)
      } else {
        // Fix: Supabase join returns chef as array, but we want object
        setFavorites(
          (favoritesData || []).map((fav: any) => ({
            ...fav,
            chef: Array.isArray(fav.chef) ? fav.chef[0] : fav.chef,
          }))
        )
      }

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          id,
          service_type,
          event_date,
          status,
          chef:chefs(name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError)
      } else {
        // Fix: Supabase join returns chef as array, but we want object
        setBookings(
          (bookingsData || []).map((b: any) => ({
            ...b,
            chef: Array.isArray(b.chef) ? b.chef[0] : b.chef,
          }))
        )
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...updatedData,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error updating profile:", error)
        return false
      }

      setProfile((prev) => (prev ? { ...prev, ...updatedData } : null))
      return true
    } catch (error) {
      console.error("Error updating profile:", error)
      return false
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User"
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="bg-primary text-white text-xl font-semibold">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-foreground">{displayName}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile?.location || "Location not set"}</span>
                    </div>
                    <span>•</span>
                    <span>Member since {joinDate}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="self-start sm:self-auto rounded-xl"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{bookings.length}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Bookings</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{favorites.length}</div>
                  <div className="text-[12px] sm:text-sm text-muted-foreground">Favorites</div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white rounded-xl p-1">
            <TabsTrigger value="profile" className="text-xs sm:text-sm rounded-lg">
              <User className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm rounded-lg">
              <Heart className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm rounded-lg">
              <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm rounded-lg">
              <Settings className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile?.full_name || ""}
                      disabled={!isEditing}
                      className="mt-1 rounded-xl"
                      onChange={(e) => setProfile((prev) => (prev ? { ...prev, full_name: e.target.value } : null))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email || ""} disabled className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile?.phone || ""}
                      disabled={!isEditing}
                      className="mt-1 rounded-xl"
                      onChange={(e) => setProfile((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile?.location || ""}
                      disabled={!isEditing}
                      className="mt-1 rounded-xl"
                      onChange={(e) => setProfile((prev) => (prev ? { ...prev, location: e.target.value } : null))}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-primary text-white rounded-xl"
                      onClick={async () => {
                        if (profile) {
                          const success = await updateProfile(profile)
                          if (success) {
                            setIsEditing(false)
                          }
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 rounded-xl">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            {favorites.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground">Start exploring chefs to add them to your favorites!</p>
                </CardContent>
              </Card>
            ) : (
              favorites.map((favorite) => (
                <motion.div key={favorite.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                          <AvatarImage src={favorite.chef.avatar_url || "/placeholder.svg"} alt={favorite.chef.name} />
                          <AvatarFallback>
                            <ChefHat className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{favorite.chef.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {favorite.chef.cuisines?.join(", ") || "Various cuisines"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">{favorite.chef.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" className="bg-primary text-white rounded-xl text-xs sm:text-sm">
                            Book Now
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl text-xs sm:text-sm bg-transparent">
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground">Book your first chef to see your activity here!</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {booking.service_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-muted-foreground">with {booking.chef.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.event_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs rounded-full ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                      <p className="text-sm text-muted-foreground">
                        {key === "bookingUpdates" && "Get notified about booking confirmations and updates"}
                        {key === "newChefs" && "Discover new chefs in your area"}
                        {key === "promotions" && "Receive special offers and discounts"}
                        {key === "reminders" && "Booking reminders and follow-ups"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">Manage cards and billing</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Privacy & Security</h3>
                    <p className="text-sm text-muted-foreground">Account security settings</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <HelpCircle className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Help & Support</h3>
                    <p className="text-sm text-muted-foreground">Get help and contact us</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                onClick={handleSignOut}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <LogOut className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="font-medium text-red-500">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">Sign out of your account</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div> 
    </div>
  )
}