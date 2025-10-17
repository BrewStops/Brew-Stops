import { Button } from "@/components/ui/button";
import { Coffee, MapPin, Heart, Navigation } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Hero Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop')",
            }}
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Coffee className="w-12 h-12 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">Brew Stops</h1>
          </div>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Find cyclist-friendly cafés along your route. Bike racks, water refills, and great coffee await.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary/90 hover:bg-primary border-2 border-primary text-primary-foreground backdrop-blur-sm"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              Get Started
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-background/20 hover:bg-background/30 border-2 border-white/40 text-white backdrop-blur-sm"
              onClick={() => {
                const features = document.getElementById('features');
                features?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Perfect Stops for Every Ride
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-md hover-elevate">
              <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Nearby Cafés</h3>
              <p className="text-muted-foreground">
                Discover cyclist-friendly cafés on your route with real-time location tracking and interactive maps.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-md hover-elevate">
              <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cyclist Amenities</h3>
              <p className="text-muted-foreground">
                Filter by bike racks, water refills, outdoor seating, and other essential cyclist-friendly features.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-md hover-elevate">
              <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Favorites</h3>
              <p className="text-muted-foreground">
                Bookmark your favorite stops and share reviews to help fellow cyclists find the best cafés.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Navigation className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Stop?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Brew Stops and discover the best cyclist-friendly cafés on your routes.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-signup-cta"
          >
            Sign Up Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 BrewStop. Find your perfect café stop.</p>
        </div>
      </footer>
    </div>
  );
}
