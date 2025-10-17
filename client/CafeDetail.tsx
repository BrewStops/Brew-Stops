import { useState } from "react";
import { MapPin, Star, Bike, Droplet, Armchair, Users, X, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReviewDialog from "./ReviewDialog";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
}

interface CafeDetailProps {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  description?: string;
  hasBikeRacks?: boolean;
  hasWaterRefill?: boolean;
  hasOutdoorSeating?: boolean;
  seatingCapacity?: number;
  menuItems?: string[];
  reviews?: Review[];
  onClose: () => void;
  onAddFavorite?: () => void;
}

export default function CafeDetail({
  id,
  name,
  address,
  imageUrl,
  rating,
  reviewCount,
  description,
  hasBikeRacks,
  hasWaterRefill,
  hasOutdoorSeating,
  seatingCapacity,
  menuItems,
  reviews,
  onClose,
  onAddFavorite,
}: CafeDetailProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="relative">
        {imageUrl ? (
          <div className="relative h-64 bg-muted">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4"
              onClick={onClose}
              data-testid="button-close-detail"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="relative h-48 bg-muted flex items-center justify-center">
            <MapPin className="h-16 w-16 text-muted-foreground" />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4"
              onClick={onClose}
              data-testid="button-close-detail"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="p-6 space-y-6 pb-24">
          <div>
            <h1 className="text-2xl font-bold mb-2" data-testid="text-cafe-name">{name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
            </div>
          </div>

          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}

          <Card className="p-4">
            <h2 className="font-semibold mb-3">Cyclist Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {hasBikeRacks && (
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Bike className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">Bike Racks</span>
                </div>
              )}
              {hasWaterRefill && (
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Droplet className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">Water Refill</span>
                </div>
              )}
              {hasOutdoorSeating && (
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Armchair className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">Outdoor Seating</span>
                </div>
              )}
              {seatingCapacity && (
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">{seatingCapacity} Seats</span>
                </div>
              )}
            </div>
          </Card>

          {menuItems && menuItems.length > 0 && (
            <Card className="p-4">
              <h2 className="font-semibold mb-3">Menu Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {menuItems.map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Reviews</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReviewDialog(true)}
                data-testid="button-write-review"
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </div>
            
            {reviews && reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{review.userName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No reviews yet. Be the first to share your experience!
              </p>
            )}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={onAddFavorite}
            data-testid="button-add-favorite"
          >
            Add to Favorites
          </Button>
        </div>
      </div>

      <ReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        cafeId={id}
        cafeName={name}
      />
    </div>
  );
}
