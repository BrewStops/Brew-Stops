import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CafeCard from "@/components/CafeCard";
import CafeDetail from "@/components/CafeDetail";
import BottomNav from "@/components/BottomNav";
import { Heart } from "lucide-react";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { calculateDistance, formatDistance } from "@/lib/distance";
import { useToast } from "@/hooks/use-toast";
import type { Cafe, Review } from "@shared/schema";

const USER_LOCATION = { lat: 40.7128, lon: -74.0060 };

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: allCafes = [] } = useQuery<Cafe[]>({
    queryKey: ["/api/cafes"],
  });

  const { data: selectedCafeData } = useQuery<Cafe>({
    queryKey: ["/api/cafes", selectedCafe],
    enabled: !!selectedCafe,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/cafes", selectedCafe, "reviews"],
    enabled: !!selectedCafe,
  });

  useEffect(() => {
    setFavorites(getFavorites());
    
    const handleStorage = () => {
      setFavorites(getFavorites());
    };
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const favoriteCafes = useMemo(() => {
    return allCafes
      .filter(cafe => favorites.includes(cafe.id))
      .map(cafe => ({
        ...cafe,
        distance: calculateDistance(
          USER_LOCATION.lat,
          USER_LOCATION.lon,
          cafe.latitude,
          cafe.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [allCafes, favorites]);

  const handleRemoveFavorite = (cafeId: string, cafeName: string) => {
    toggleFavorite(cafeId);
    setFavorites(getFavorites());
    toast({
      title: "Removed from favorites",
      description: cafeName,
    });
    setSelectedCafe(null);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-primary/5 backdrop-blur-sm z-10 border-b border-primary/20">
        <div className="max-w-lg mx-auto p-4">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Heart className="h-6 w-6" />
            Favorites
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        {favoriteCafes.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground">
              Start adding cafés to your favorites to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteCafes.map(cafe => (
              <CafeCard
                key={cafe.id}
                id={cafe.id}
                name={cafe.name}
                address={cafe.address}
                distance={formatDistance(cafe.distance)}
                isOpen={cafe.isOpen}
                hasBikeRacks={cafe.hasBikeRacks}
                hasWaterRefill={cafe.hasWaterRefill}
                hasOutdoorSeating={cafe.hasOutdoorSeating}
                imageUrl={cafe.imageUrl ?? undefined}
                onClick={() => setSelectedCafe(cafe.id)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedCafeData && (
        <CafeDetail
          name={selectedCafeData.name}
          address={selectedCafeData.address}
          imageUrl={selectedCafeData.imageUrl ?? undefined}
          rating={averageRating}
          reviewCount={reviews.length}
          description={selectedCafeData.description ?? undefined}
          hasBikeRacks={selectedCafeData.hasBikeRacks}
          hasWaterRefill={selectedCafeData.hasWaterRefill}
          hasOutdoorSeating={selectedCafeData.hasOutdoorSeating}
          seatingCapacity={selectedCafeData.seatingCapacity ?? undefined}
          menuItems={selectedCafeData.menuItems ?? undefined}
          reviews={reviews.map(r => ({
            id: r.id,
            userName: r.userName,
            rating: r.rating,
            comment: r.comment,
          }))}
          onClose={() => setSelectedCafe(null)}
          onAddFavorite={() => handleRemoveFavorite(selectedCafeData.id, selectedCafeData.name)}
        />
      )}

      <BottomNav />
    </div>
  );
}
