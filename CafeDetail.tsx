import CafeDetail from "../CafeDetail";

export default function CafeDetailExample() {
  const mockReviews = [
    {
      id: "1",
      userName: "Sarah M.",
      rating: 5,
      comment: "Perfect stop on my weekend rides! Great coffee and the bike racks are super secure.",
    },
    {
      id: "2",
      userName: "Mike T.",
      rating: 4,
      comment: "Love the outdoor seating area. Free water refills are a lifesaver after long rides.",
    },
  ];

  return (
    <CafeDetail
      name="Riverside Cafe"
      address="282 River Rd"
      rating={4.5}
      reviewCount={120}
      description="A cozy café by the river, perfect for cyclists looking for a peaceful stop."
      hasBikeRacks={true}
      hasWaterRefill={true}
      hasOutdoorSeating={true}
      seatingCapacity={30}
      menuItems={["Coffee", "Pastries", "Sandwiches", "Smoothies"]}
      reviews={mockReviews}
      onClose={() => console.log("Close clicked")}
      onAddFavorite={() => console.log("Added to favorites")}
    />
  );
}
