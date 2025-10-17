import { User, Heart, Star, Settings, HelpCircle, ChevronRight, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: <User className="h-5 w-5" />, label: "Profile", href: "/profile/edit" },
  { icon: <Heart className="h-5 w-5" />, label: "Favorites", href: "/favorites" },
  { icon: <Star className="h-5 w-5" />, label: "Reviews", href: "/profile/reviews" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
  { icon: <HelpCircle className="h-5 w-5" />, label: "Help", href: "/help" },
];

export default function Profile() {
  const { user } = useAuth();

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.email?.split('@')[0] || "User";

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary/5 p-6">
        <div className="max-w-lg mx-auto text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            {user?.profileImageUrl && (
              <AvatarImage 
                src={user.profileImageUrl} 
                alt={displayName}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-primary/20 text-primary text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold mb-1" data-testid="text-user-name">
            {displayName}
          </h1>
          {user?.email && (
            <p className="text-muted-foreground" data-testid="text-user-email">
              {user.email}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="p-4 hover-elevate cursor-pointer"
              onClick={() => console.log(`Navigate to ${item.href}`)}
              data-testid={`button-${item.label.toLowerCase()}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-primary">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
          
          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 p-4 h-auto"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log Out</span>
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
