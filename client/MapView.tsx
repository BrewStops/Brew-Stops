import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface CafeMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  cafes: CafeMarker[];
  selectedCafeId?: string;
  onCafeClick?: (id: string) => void;
}

// Component to handle geolocation and map updates
function MapController({ userLocation }: { userLocation: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  return null;
}

export default function MapView({ cafes, selectedCafeId, onCafeClick }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  // Default center (San Francisco)
  const defaultCenter: [number, number] = [37.7749, -122.4194];

  // Get user's location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location");
        }
      );
    }
  }, []);

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location");
        }
      );
    }
  };

  // Create a custom icon for user location
  const userIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={userLocation || defaultCenter}
        zoom={13}
        className="w-full h-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController userLocation={userLocation} />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Café markers */}
        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            position={[cafe.latitude, cafe.longitude]}
            eventHandlers={{
              click: () => onCafeClick?.(cafe.id),
            }}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold">{cafe.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Locate Me Button */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Button
          size="icon"
          onClick={handleLocateMe}
          data-testid="button-locate-me"
          className="bg-background shadow-md"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="absolute top-16 right-4 z-[1000] bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm">
          {locationError}
        </div>
      )}
    </div>
  );
}
