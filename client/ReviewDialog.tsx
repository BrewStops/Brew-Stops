import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cafeId: string;
  cafeName: string;
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  required?: boolean;
}

function StarRating({ value, onChange, label, required = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none transition-transform hover:scale-110"
            data-testid={`star-${label.toLowerCase().replace(/\s+/g, '-')}-${star}`}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hover || value)
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted"
              }`}
            />
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-sm text-muted-foreground">
          {value === 1 && "Poor"}
          {value === 2 && "Fair"}
          {value === 3 && "Good"}
          {value === 4 && "Very Good"}
          {value === 5 && "Excellent"}
        </p>
      )}
    </div>
  );
}

export default function ReviewDialog({
  open,
  onOpenChange,
  cafeId,
  cafeName,
}: ReviewDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [overallRating, setOverallRating] = useState(0);
  const [coffeeRating, setCoffeeRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [bikeFriendlyRating, setBikeFriendlyRating] = useState(0);
  const [groupFriendlyRating, setGroupFriendlyRating] = useState(0);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to submit a review");
      }

      const userName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || user.email || "Anonymous";

      const reviewData = {
        cafeId,
        userId: user.id,
        userName,
        userAvatar: user.profileImageUrl,
        rating: overallRating,
        ratingOverall: overallRating,
        ratingCoffee: coffeeRating || undefined,
        ratingFood: foodRating || undefined,
        ratingValue: valueRating || undefined,
        ratingBikeFriendly: bikeFriendlyRating || undefined,
        ratingGroupFriendly: groupFriendlyRating || undefined,
        comment,
      };

      return await apiRequest("POST", "/api/reviews", reviewData);
    },
    onSuccess: () => {
      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cafes", cafeId, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cafes"] });
      onOpenChange(false);
      // Reset form
      setOverallRating(0);
      setCoffeeRating(0);
      setFoodRating(0);
      setValueRating(0);
      setBikeFriendlyRating(0);
      setGroupFriendlyRating(0);
      setComment("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (overallRating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide an overall rating",
        variant: "destructive",
      });
      return;
    }

    if (comment.length > 500) {
      toast({
        title: "Comment too long",
        description: "Please keep your comment under 500 characters",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience at {cafeName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating - Required */}
          <StarRating
            value={overallRating}
            onChange={setOverallRating}
            label="Overall Rating"
            required
          />

          {/* Optional Detailed Ratings */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Detailed Ratings (Optional)</h3>
            
            <StarRating
              value={coffeeRating}
              onChange={setCoffeeRating}
              label="Coffee Quality"
            />

            <StarRating
              value={foodRating}
              onChange={setFoodRating}
              label="Food Quality"
            />

            <StarRating
              value={valueRating}
              onChange={setValueRating}
              label="Value for Money"
            />

            <StarRating
              value={bikeFriendlyRating}
              onChange={setBikeFriendlyRating}
              label="Bike Friendliness"
            />

            <StarRating
              value={groupFriendlyRating}
              onChange={setGroupFriendlyRating}
              label="Group Friendliness"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Experience (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Tell us about your visit... What did you enjoy? Any tips for other cyclists?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={4}
              data-testid="input-review-comment"
            />
            <p className={`text-xs ${
              comment.length >= 500 
                ? 'text-destructive' 
                : comment.length >= 450 
                  ? 'text-yellow-600 dark:text-yellow-500' 
                  : 'text-muted-foreground'
            }`}>
              {comment.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-review"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending || overallRating === 0}
              data-testid="button-submit-review"
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
