import { useState } from "react";
import MapView from "../MapView";

export default function MapViewExample() {
  const [selected, setSelected] = useState<string>();
  
  const mockCafes = [
    { id: "1", name: "Café Latte", latitude: 40.7128, longitude: -74.0060 },
    { id: "2", name: "Oakwood Café", latitude: 40.7580, longitude: -73.9855 },
    { id: "3", name: "Riverbank Coffee", latitude: 40.7489, longitude: -73.9680 },
  ];

  return (
    <div className="h-96">
      <MapView 
        cafes={mockCafes}
        selectedCafeId={selected}
        onCafeClick={setSelected}
      />
    </div>
  );
}
