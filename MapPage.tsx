import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import MapView from "@/components/MapView";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";
import type { Cafe, Review } from "@shared/schema";

export default function MapPage() {
  const [, setLocation] = useLocation();
  const [selectedCafe, setSelectedCafe] = useState<string>();

  const { data: cafes = [] } = useQuery<Cafe[]>({
    queryKey: ["/api/cafes"],
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/cafes", selectedCafe, "reviews"],
    enabled: !!selectedCafe,
  });

  const selectedCafeData = cafes.find(cafe => cafe.id === selectedCafe);
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="p-4 bg-primary/5 border-b border-primary/20">
        <h1 className="text-xl font-bold text-primary">Café Map</h1>
      </header>

      <div className="flex-1 relative">
        <MapView
          cafes={cafes.map(cafe => ({
            id: cafe.id,
            name: cafe.name,
            latitude: cafe.latitude,
            longitude: cafe.longitude,
          }))}
          selectedCafeId={selectedCafe}
          onCafeClick={setSelectedCafe}
        />

        {selectedCafeData && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-1" data-testid="text-selected-cafe">
                {selectedCafeData.name}
              </h3>
              <div className="flex items-center gap-2">
                {averageRating > 0 && (
                  <>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(averageRating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Floating Add Café Button */}
        <Button
          size="icon"
          className="absolute top-4 right-4 h-12 w-12 rounded-full shadow-lg"
          onClick={() => setLocation("/submit")}
          data-testid="button-add-cafe-map"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
