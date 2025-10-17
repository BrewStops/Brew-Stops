import { Bike, Droplet, Armchair } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AmenityType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface AmenityFilterProps {
  amenities: AmenityType[];
  selectedAmenities: string[];
  onToggle: (id: string) => void;
}

export default function AmenityFilter({ amenities, selectedAmenities, onToggle }: AmenityFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {amenities.map((amenity) => {
        const isSelected = selectedAmenities.includes(amenity.id);
        return (
          <Badge
            key={amenity.id}
            variant={isSelected ? "default" : "outline"}
            className={`
              flex items-center gap-2 px-4 py-2.5 cursor-pointer whitespace-nowrap
              ${isSelected ? 'bg-primary text-primary-foreground' : 'hover-elevate'}
            `}
            onClick={() => onToggle(amenity.id)}
            data-testid={`filter-${amenity.id}`}
          >
            {amenity.icon}
            <span className="text-sm font-medium">{amenity.label}</span>
          </Badge>
        );
      })}
    </div>
  );
}

export const AMENITIES: AmenityType[] = [
  { id: "bikeRacks", label: "Bike Racks", icon: <Bike className="h-4 w-4" /> },
  { id: "waterRefill", label: "Water Refill", icon: <Droplet className="h-4 w-4" /> },
  { id: "outdoorSeating", label: "Outdoor Seating", icon: <Armchair className="h-4 w-4" /> },
];
