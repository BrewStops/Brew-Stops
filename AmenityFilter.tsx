import { useState } from "react";
import AmenityFilter, { AMENITIES } from "../AmenityFilter";

export default function AmenityFilterExample() {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <AmenityFilter 
      amenities={AMENITIES}
      selectedAmenities={selected}
      onToggle={handleToggle}
    />
  );
}
