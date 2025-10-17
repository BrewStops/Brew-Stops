import { MapPin, Bike, Droplet, Armchair } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CafeCardProps {
  id: string;
  name: string;
  address: string;
  distance: string;
  isOpen: boolean;
  hasBikeRacks?: boolean;
  hasWaterRefill?: boolean;
  hasOutdoorSeating?: boolean;
  imageUrl?: string;
  onClick?: () => void;
}

export default function CafeCard({
  id,
  name,
  address,
  distance,
  isOpen,
  hasBikeRacks,
  hasWaterRefill,
  hasOutdoorSeating,
  imageUrl,
  onClick,
}: CafeCardProps) {
  return (
    <Card
      className="p-4 hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`card-cafe-${id}`}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-primary/10 flex-shrink-0 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary">
              <MapPin className="h-8 w-8" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate" data-testid={`text-cafe-name-${id}`}>
              {name}
            </h3>
            <Badge
              variant="outline"
              className={`flex-shrink-0 ${isOpen ? 'text-green-600 border-green-600' : 'text-muted-foreground'}`}
            >
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 truncate">
            {distance} • {address}
          </p>
          
          <div className="flex gap-3 text-sm">
            {hasBikeRacks && (
              <div className="flex items-center gap-1 text-primary">
                <Bike className="h-4 w-4" />
                <span className="text-muted-foreground">Bike racks</span>
              </div>
            )}
            {hasWaterRefill && (
              <div className="flex items-center gap-1 text-primary">
                <Droplet className="h-4 w-4" />
                <span className="text-muted-foreground">Water</span>
              </div>
            )}
            {hasOutdoorSeating && (
              <div className="flex items-center gap-1 text-primary">
                <Armchair className="h-4 w-4" />
                <span className="text-muted-foreground">Outdoor</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
