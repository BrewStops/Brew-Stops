import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, MapPin, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertCafeSchema } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function SubmitCafeEnhanced() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm({
    resolver: zodResolver(
      insertCafeSchema.omit({ userId: true }).extend({
        hours: insertCafeSchema.shape.hours.optional(),
        menuHighlights: insertCafeSchema.shape.menuHighlights.optional(),
        galleryImages: insertCafeSchema.shape.galleryImages.optional(),
      })
    ),
    defaultValues: {
      // Basics
      name: "",
      description: "",
      phone: "",
      website: "",
      email: "",
      
      // Location
      latitude: 0,
      longitude: 0,
      address: "",
      town: "",
      postcode: "",
      country: "UK",
      
      // Hours
      opensEarly: false,
      opensLate: false,
      holidayNotes: "",
      
      // Group capacity
      maxIndoorSeats: undefined,
      maxOutdoorSeats: undefined,
      maxRiderGroup: undefined,
      canBookGroups: false,
      bookingLink: "",
      queueTolerant: false,
      
      // Bike parking
      bikeParkingType: "open",
      bikeParkingCount: 5,
      bikeParkingVisible: false,
      bikeParkingSecure: false,
      bikeParkingCCTV: false,
      bikeParkingLockable: false,
      
      // Amenities
      hasToilets: false,
      hasBabyChange: false,
      hasRepairStand: false,
      hasTrackPump: false,
      hasBasicTools: false,
      hasPowerSockets: false,
      hasWifi: false,
      hasWaterRefill: false,
      waterRefillFree: true,
      
      // Outdoor seating
      hasOutdoorSeating: false,
      outdoorSeatingHeated: false,
      outdoorSeatingSheltered: false,
      
      // Service
      serviceType: "quick_counter",
      averageServeTime: 10,
      canPreOrderGroups: false,
      
      // Payment
      acceptsCard: true,
      acceptsCash: true,
      splitsBill: false,
      hasTapToPay: true,
      
      // Dietary
      glutenFreeFriendly: false,
      veganOptions: false,
      vegetarianOptions: false,
      dairyFreeOptions: false,
      nutAware: false,
      dietaryNotes: "",
      
      // Menu
      menuFocus: "cakes_bakes",
      coffeeQuality: "good",
      priceLevel: 2,
      
      // Accessibility & friendliness
      stepFree: false,
      accessibleToilet: false,
      dogFriendly: false,
      kidsFriendly: false,
      rainPlan: false,
      
      // Photos
      heroImage: "",
      
      // Legacy compatibility
      hasBikeRacks: false,
      isOpen: true,
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
      <header className="bg-primary/5 p-4 border-b flex items-center gap-3 sticky top-0 z-10 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-primary">Add a Cyclist-Friendly Café</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="cycling">Cycling</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* Basics Tab */}
              <TabsContent value="basics" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Café Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="The Coffee House" {...field} data-testid="input-cafe-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description (≤160 chars)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of the café..."
                              maxLength={160}
                              {...field}
                              value={field.value || ""}
                              data-testid="input-description"
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/160 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+44 20 1234 5678" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Location</h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} data-testid="input-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="town"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Town/City</FormLabel>
                            <FormControl>
                              <Input placeholder="London" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postcode</FormLabel>
                            <FormControl>
                              <Input placeholder="SW1A 1AA" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="UK" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>GPS Coordinates *</Label>
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
                  </div>
                </Card>
              </TabsContent>

              {/* Cycling Tab */}
              <TabsContent value="cycling" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Bike Parking</h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bikeParkingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bike Parking Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select parking type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="covered">Covered Racks</SelectItem>
                              <SelectItem value="open">Open Racks</SelectItem>
                              <SelectItem value="inside">Bring Bikes Inside</SelectItem>
                              <SelectItem value="none">No Bike Parking</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bikeParkingCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Bike Spaces</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val === "" ? undefined : parseInt(val));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <Label>Bike Parking Features</Label>
                      <FormField
                        control={form.control}
                        name="bikeParkingVisible"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-md border p-3">
                            <FormLabel className="text-base font-normal m-0">
                              Visible from tables
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bikeParkingCCTV"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-md border p-3">
                            <FormLabel className="text-base font-normal m-0">
                              CCTV Coverage
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bikeParkingLockable"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-md border p-3">
                            <FormLabel className="text-base font-normal m-0">
                              Lockable Area
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Cyclist Facilities</h2>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="hasWaterRefill"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">
                            Water Bottle Refill
                          </FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} data-testid="switch-water-refill" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasTrackPump"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">
                            Track Pump Available
                          </FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasRepairStand"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">
                            Repair Stand
                          </FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasBasicTools"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">
                            Basic Tools
                          </FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Group Riding</h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="maxRiderGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Rider Group Size</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 12"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val === "" ? undefined : parseInt(val));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="canBookGroups"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">
                            Can book for groups
                          </FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="queueTolerant"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">
                            Queue tolerant (OK with 10+ riders arriving)
                          </FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rainPlan"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">
                            Rain Plan (can seat group inside if it rains)
                          </FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </TabsContent>

              {/* Amenities Tab */}
              <TabsContent value="amenities" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">General Amenities</h2>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="hasToilets"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Toilets</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasPowerSockets"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Power Sockets</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasWifi"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Wi-Fi</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stepFree"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Step-Free Access</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accessibleToilet"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Accessible Toilet</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Outdoor Seating</h2>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="hasOutdoorSeating"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Has Outdoor Seating</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} data-testid="switch-outdoor-seating" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="outdoorSeatingHeated"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Heated Outdoor Area</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="outdoorSeatingSheltered"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Sheltered Outdoor Area</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Dietary Options</h2>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="glutenFreeFriendly"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Gluten-Free Friendly</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="veganOptions"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Vegan Options</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vegetarianOptions"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Vegetarian Options</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dairyFreeOptions"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Dairy-Free Options</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dietaryNotes"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Dietary Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Cross-contamination notes, allergen info..."
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Menu & Service</h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="menuFocus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Menu Focus</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select menu focus" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="big_breakfasts">Big Breakfasts</SelectItem>
                              <SelectItem value="cakes_bakes">Cakes & Bakes</SelectItem>
                              <SelectItem value="light_bites">Light Bites</SelectItem>
                              <SelectItem value="proper_meals">Proper Meals</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coffeeQuality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coffee Quality</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select coffee quality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="specialty">Specialty</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="basic">Basic</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Level</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString() || "2"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select price level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">£ - Budget</SelectItem>
                              <SelectItem value="2">££ - Moderate</SelectItem>
                              <SelectItem value="3">£££ - Premium</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="quick_counter">Quick Counter Service</SelectItem>
                              <SelectItem value="table_service">Table Service</SelectItem>
                              <SelectItem value="preorder_friendly">Pre-Order Friendly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Friendly To</h2>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="dogFriendly"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Dog Friendly</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="kidsFriendly"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <FormLabel className="text-base font-normal m-0">Kids Friendly</FormLabel>
                          <FormControl>
                            <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Photos</h2>
                  
                  <FormField
                    control={form.control}
                    name="heroImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/cafe-photo.jpg"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-image-url"
                          />
                        </FormControl>
                        <FormDescription>
                          Main photo of the café
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 sticky bottom-4 bg-background p-4 border-t">
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
      </main>
    </div>
  );
}
