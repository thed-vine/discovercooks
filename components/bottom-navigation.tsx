"use client"

import { Home, Search, Calendar, User, LogIn } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { href: "/", icon: Home, label: "Feed" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/bookings", icon: Calendar, label: "Bookings", requiresAuth: true },
  { href: "/profile", icon: User, label: "Profile", requiresAuth: true },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const { user, loading } = useAuth()

  // Don't show navigation on auth pages
  if (pathname.startsWith("/auth/")) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-sm md:bg-card">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto md:max-w-lg">
        {navItems.map(({ href, icon: Icon, label, requiresAuth }) => {
          const isActive = pathname === href

          if (requiresAuth && !user && !loading) {
            if (label === "Profile") {
              return (
                <Link
                  key="login"
                  href="/auth/login"
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 hover:scale-105 active:scale-95",
                    "text-foreground/70 hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <LogIn className="h-5 w-5 md:h-4 md:w-4" />
                  <span className="text-xs font-medium truncate">Login</span>
                </Link>
              )
            }
            // Skip bookings if not authenticated
            return null
          }

          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 hover:scale-105 active:scale-95",
                // Apply different styles based on whether we're on home page or not
                isHomePage
                  ? isActive
                    ? "text-white bg-primary shadow-lg" // Active on home page
                    : "text-black hover:text-foreground hover:bg-muted/50" // Inactive on home page
                  : isActive
                    ? "text-white bg-primary shadow-lg" // Active on other pages
                    : "text-black" // Inactive on other pages
              )}
            >
              <Icon className="h-5 w-5 md:h-4 md:w-4" />
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}