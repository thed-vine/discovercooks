"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
} from "lucide-react"

type NotificationSettings = {
  bookingUpdates: boolean
  newChefs: boolean
  promotions: boolean
  reminders: boolean
}

// Mock user data
const mockUser: {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  location: string
  joinDate: string
  totalBookings: number
  favoriteChefs: number
  averageRating: number
  preferences: {
    cuisines: string[]
    dietaryRestrictions: string[]
    priceRange: string
  }
  notifications: NotificationSettings
} = {
  id: "user-1",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "/chef-portrait.png",
  location: "New York, NY",
  joinDate: "March 2023",
  totalBookings: 12,
  favoriteChefs: 8,
  averageRating: 4.8,
  preferences: {
    cuisines: ["Italian", "Japanese", "French"],
    dietaryRestrictions: ["Vegetarian"],
    priceRange: "$$$",
  },
  notifications: {
    bookingUpdates: true,
    newChefs: false,
    promotions: true,
    reminders: true,
  },
}

const mockFavoriteChefs = [
  {
    id: "1",
    name: "Marco Rodriguez",
    avatar: "/chef-portrait.png",
    cuisine: "Italian",
    rating: 4.9,
    lastBooked: "2 weeks ago",
  },
  {
    id: "2",
    name: "Sakura Tanaka",
    avatar: "/japanese-chef-portrait.png",
    cuisine: "Japanese",
    rating: 4.8,
    lastBooked: "1 month ago",
  },
  {
    id: "3",
    name: "Antoine Dubois",
    avatar: "/french-chef-portrait.png",
    cuisine: "French",
    rating: 4.9,
    lastBooked: "3 weeks ago",
  },
]

const mockRecentBookings = [
  {
    id: "1",
    chef: "Marco Rodriguez",
    service: "Private Dinner Party",
    date: "Dec 15, 2023",
    status: "completed",
    rating: 5,
  },
  {
    id: "2",
    chef: "Sakura Tanaka",
    service: "Sushi Making Class",
    date: "Nov 28, 2023",
    status: "completed",
    rating: 5,
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState<NotificationSettings>(mockUser.notifications)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
              <AvatarFallback className="bg-primary text-white text-xl font-semibold">
                {mockUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-foreground">{mockUser.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{mockUser.location}</span>
                    </div>
                    <span>•</span>
                    <span>Member since {mockUser.joinDate}</span>
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
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{mockUser.totalBookings}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Bookings</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{mockUser.favoriteChefs}</div>
                  <div className="text-[12px] sm:text-sm text-muted-foreground">Favorites</div>
                </div>
                {/* <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                    <span className="text-xl sm:text-2xl font-bold text-foreground">{mockUser.averageRating}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Rating</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-fit grid-cols-4 mb-4 bg-white rounded-xl">
            <TabsTrigger value="profile" className="text-xs sm:text-sm rounded-lg">
              <User className="h-4 w-4 mr-1 sm:mr-2" />
              {activeTab === "profile" && <span className="sm:inline">Profile</span>}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm rounded-lg">
              <Heart className="h-4 w-4 mr-1 sm:mr-2" />
              {activeTab === "favorites" && <span className="sm:inline">Favorites</span>}
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm rounded-lg">
              <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
              {activeTab === "activity" && <span className="sm:inline">Activity</span>}
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm rounded-lg">
              <Settings className="h-4 w-4 mr-1 sm:mr-2" />
              {activeTab === "settings" && <span className="sm:inline">Settings</span>}
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
                    <Input id="name" value={mockUser.name} disabled={!isEditing} className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={mockUser.email} disabled={!isEditing} className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={mockUser.phone} disabled={!isEditing} className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={mockUser.location} disabled={!isEditing} className="mt-1 rounded-xl" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferences">Cuisine Preferences</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mockUser.preferences.cuisines.map((cuisine) => (
                      <Badge key={cuisine} className="bg-primary/10 text-primary border-primary/20 rounded-full">
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-primary text-white rounded-xl">Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 rounded-xl">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {mockFavoriteChefs.map((chef) => (
              <motion.div key={chef.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                        <AvatarImage src={chef.avatar || "/placeholder.svg"} alt={chef.name} />
                        <AvatarFallback>
                          <ChefHat className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{chef.name}</h3>
                        <p className="text-sm text-muted-foreground">{chef.cuisine} Cuisine</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{chef.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">• Last booked {chef.lastBooked}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link href={`/book/${chef.id}`}>
                        <Button size="sm" className="bg-primary text-white rounded-xl text-xs sm:text-sm">
                          Book Again
                        </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="rounded-xl text-xs sm:text-sm bg-transparent">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{booking.service}</h4>
                      <p className="text-sm text-muted-foreground">with {booking.chef}</p>
                      <p className="text-xs text-muted-foreground">{booking.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(booking.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs rounded-full">{booking.status}</Badge>
                    </div>
                  </div>
                ))}
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
                {(Object.entries(notifications) as [keyof NotificationSettings, boolean][]).map(([key, value]) => (
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
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [key]: Boolean(checked) }))
                      }
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

              <Card className="border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
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
  )
}
