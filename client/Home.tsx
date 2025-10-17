import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import AmenityFilter, { AMENITIES } from "@/components/AmenityFilter";
import CafeCard from "@/components/CafeCard";
import CafeDetail from "@/components/CafeDetail";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { calculateDistance, formatDistance } from "@/lib/distance";
import { toggleFavorite } from "@/lib/favorites";
import { useToast } from "@/hooks/use-toast";
import type { Cafe, Review } from "@shared/schema";

// Mock user location (NYC) - in production, would use geolocation API
const USER_LOCATION = { lat: 40.7128, lon: -74.0060 };

export default function Home() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: cafes = [], isLoading } = useQuery<Cafe[]>({
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

  const handleToggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const filteredCafes = useMemo(() => {
    return cafes
      .filter(cafe => {
        const matchesSearch = 
          search === "" ||
          cafe.name.toLowerCase().includes(search.toLowerCase()) ||
          cafe.address.toLowerCase().includes(search.toLowerCase());
        
        const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => {
          if (amenity === "bikeRacks") return cafe.hasBikeRacks;
          if (amenity === "waterRefill") return cafe.hasWaterRefill;
          if (amenity === "outdoorSeating") return cafe.hasOutdoorSeating;
          return false;
        });
        
        return matchesSearch && matchesAmenities;
      })
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
  }, [cafes, search, selectedAmenities]);

  const handleAddFavorite = (cafeId: string, cafeName: string) => {
    const isNowFavorite = toggleFavorite(cafeId);
    toast({
      title: isNowFavorite ? "Added to favorites" : "Removed from favorites",
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
        <div className="max-w-lg mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary" data-testid="text-app-title">
              BrewStop
            </h1>
            <Button
              size="sm"
              onClick={() => setLocation("/submit")}
              data-testid="button-submit-cafe"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Café
            </Button>
          </div>
          <SearchBar value={search} onChange={setSearch} />
          <AmenityFilter
            amenities={AMENITIES}
            selectedAmenities={selectedAmenities}
            onToggle={handleToggleAmenity}
          />
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Nearby Cafés</h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading cafés...</div>
        ) : filteredCafes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No cafés found matching your criteria
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCafes.map(cafe => (
              <CafeCard
                key={cafe.id}
                id={cafe.id}
                name={cafe.name}
                address={cafe.address}
                distance={formatDistance(cafe.distance)}
                isOpen={cafe.isOpen ?? true}
                hasBikeRacks={cafe.hasBikeRacks ?? false}
                hasWaterRefill={cafe.hasWaterRefill ?? false}
                hasOutdoorSeating={cafe.hasOutdoorSeating ?? false}
                imageUrl={cafe.imageUrl ?? undefined}
                onClick={() => setSelectedCafe(cafe.id)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedCafeData && (
        <CafeDetail
          id={selectedCafeData.id}
          name={selectedCafeData.name}
          address={selectedCafeData.address}
          imageUrl={selectedCafeData.imageUrl ?? undefined}
          rating={averageRating}
          reviewCount={reviews.length}
          description={selectedCafeData.description ?? undefined}
          hasBikeRacks={selectedCafeData.hasBikeRacks ?? false}
          hasWaterRefill={selectedCafeData.hasWaterRefill ?? false}
          hasOutdoorSeating={selectedCafeData.hasOutdoorSeating ?? false}
          seatingCapacity={selectedCafeData.seatingCapacity ?? undefined}
          menuItems={selectedCafeData.menuItems ?? undefined}
          reviews={reviews.map(r => ({
            id: r.id,
            userName: r.userName,
            rating: r.rating,
            comment: r.comment,
          }))}
          onClose={() => setSelectedCafe(null)}
          onAddFavorite={() => handleAddFavorite(selectedCafeData.id, selectedCafeData.name)}
        />
      )}

      <BottomNav />
    </div>
  );
}
