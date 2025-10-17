import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertCafeSchema } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function SubmitCafe() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm({
    resolver: zodResolver(
      insertCafeSchema
        .omit({ userId: true }) // Server adds userId from auth
        .extend({
          menuItems: insertCafeSchema.shape.menuItems.optional(),
        })
    ),
    defaultValues: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      description: "",
      imageUrl: "",
      hasBikeRacks: false,
      hasWaterRefill: false,
      hasOutdoorSeating: false,
      isOpen: true,
      seatingCapacity: 20,
      menuItems: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("/api/cafes", "POST", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Café submitted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cafes"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit café. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          form.setValue("latitude", lat);
          form.setValue("longitude", lng);
          toast({
            title: "Location captured",
            description: "Your current location has been set",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get your location",
            variant: "destructive",
          });
        }
      );
    }
  };

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-primary/5 p-4 border-b flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-primary">Submit a Café</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Café Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="The Coffee House" 
                        {...field} 
                        data-testid="input-cafe-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123 Main St, San Francisco, CA" 
                        {...field} 
                        data-testid="input-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Location *</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any" 
                            placeholder="Latitude" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            data-testid="input-latitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any" 
                            placeholder="Longitude" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            data-testid="input-longitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetLocation}
                  data-testid="button-use-current-location"
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use Current Location
                </Button>
                {userLocation && (
                  <p className="text-sm text-muted-foreground">
                    Location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about this café..." 
                        {...field} 
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                        data-testid="input-image-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Cyclist Amenities</FormLabel>
                
                <FormField
                  control={form.control}
                  name="hasBikeRacks"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <FormLabel className="text-base font-normal m-0">
                        Bike Rack Available
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-bike-rack"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasWaterRefill"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <FormLabel className="text-base font-normal m-0">
                        Water Refill Station
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-water-refill"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasOutdoorSeating"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <FormLabel className="text-base font-normal m-0">
                        Outdoor Seating
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-outdoor-seating"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/")}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={mutation.isPending}
                  data-testid="button-submit-cafe"
                >
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Café
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
