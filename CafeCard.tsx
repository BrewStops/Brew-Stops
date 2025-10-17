import CafeCard from "../CafeCard";

export default function CafeCardExample() {
  return (
    <div className="space-y-4">
      <CafeCard
        id="1"
        name="Café Latte"
        address="123 Main St"
        distance="1.2 mi"
        isOpen={true}
        hasBikeRacks={true}
        hasOutdoorSeating={true}
        onClick={() => console.log("Café clicked")}
      />
      <CafeCard
        id="2"
        name="Oakwood Café"
        address="456 Park Ave"
        distance="0.8 mi"
        isOpen={true}
        hasOutdoorSeating={true}
        hasBikeRacks={true}
        hasWaterRefill={true}
        onClick={() => console.log("Café clicked")}
      />
    </div>
  );
}
