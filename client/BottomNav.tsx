import { Home, Search, MapPin, Heart, User } from "lucide-react";
import { Link, useLocation } from "wouter";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="h-5 w-5" />, label: "Home", path: "/" },
  { icon: <Search className="h-5 w-5" />, label: "Search", path: "/search" },
  { icon: <MapPin className="h-5 w-5" />, label: "Map", path: "/map" },
  { icon: <Heart className="h-5 w-5" />, label: "Favorites", path: "/favorites" },
  { icon: <User className="h-5 w-5" />, label: "Profile", path: "/profile" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`
                  flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[60px]
                  transition-colors
                  ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
