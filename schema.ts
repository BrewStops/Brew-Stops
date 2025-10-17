import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, real, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - MANDATORY for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - MANDATORY for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comprehensive cafes table with all rider-useful fields
export const cafes = pgTable("cafes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Basic info
  name: text("name").notNull(),
  description: text("description"), // short description ≤160 chars
  phone: varchar("phone"),
  website: text("website"),
  email: varchar("email"),
  
  // Location
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address").notNull(),
  town: varchar("town"),
  postcode: varchar("postcode"),
  country: varchar("country").default("UK"),
  plusCode: varchar("plus_code"),
  
  // Opening hours (JSON object with weekday keys)
  hours: jsonb("hours"), // { monday: { open: "07:00", close: "18:00", closed: false }, ... }
  holidayNotes: text("holiday_notes"),
  opensEarly: boolean("opens_early").default(false), // <07:30
  opensLate: boolean("opens_late").default(false), // >18:00
  
  // Group capacity
  maxIndoorSeats: integer("max_indoor_seats"),
  maxOutdoorSeats: integer("max_outdoor_seats"),
  maxRiderGroup: integer("max_rider_group"),
  canBookGroups: boolean("can_book_groups").default(false),
  bookingLink: text("booking_link"),
  queueTolerant: boolean("queue_tolerant").default(false),
  
  // Bike parking
  bikeParkingType: varchar("bike_parking_type"), // "covered" | "open" | "inside" | "none"
  bikeParkingCount: integer("bike_parking_count"),
  bikeParkingVisible: boolean("bike_parking_visible").default(false),
  bikeParkingSecure: boolean("bike_parking_secure").default(false),
  bikeParkingCCTV: boolean("bike_parking_cctv").default(false),
  bikeParkingLockable: boolean("bike_parking_lockable").default(false),
  
  // Amenities
  hasToilets: boolean("has_toilets").default(false),
  hasBabyChange: boolean("has_baby_change").default(false),
  hasRepairStand: boolean("has_repair_stand").default(false),
  hasTrackPump: boolean("has_track_pump").default(false),
  hasBasicTools: boolean("has_basic_tools").default(false),
  hasPowerSockets: boolean("has_power_sockets").default(false),
  hasWifi: boolean("has_wifi").default(false),
  hasWaterRefill: boolean("has_water_refill").default(false),
  waterRefillFree: boolean("water_refill_free").default(true),
  
  // Outdoor seating
  hasOutdoorSeating: boolean("has_outdoor_seating").default(false),
  outdoorSeatingHeated: boolean("outdoor_seating_heated").default(false),
  outdoorSeatingSheltered: boolean("outdoor_seating_sheltered").default(false),
  
  // Service
  serviceType: varchar("service_type"), // "quick_counter" | "table_service" | "preorder_friendly"
  averageServeTime: integer("average_serve_time"), // in minutes
  canPreOrderGroups: boolean("can_pre_order_groups").default(false),
  
  // Payment
  acceptsCard: boolean("accepts_card").default(true),
  acceptsCash: boolean("accepts_cash").default(true),
  splitsBill: boolean("splits_bill").default(false),
  hasTapToPay: boolean("has_tap_to_pay").default(true),
  
  // Dietary
  glutenFreeFriendly: boolean("gluten_free_friendly").default(false),
  veganOptions: boolean("vegan_options").default(false),
  vegetarianOptions: boolean("vegetarian_options").default(false),
  dairyFreeOptions: boolean("dairy_free_options").default(false),
  nutAware: boolean("nut_aware").default(false),
  dietaryNotes: text("dietary_notes"),
  
  // Menu
  menuFocus: varchar("menu_focus"), // "big_breakfasts" | "cakes_bakes" | "light_bites" | "proper_meals"
  menuHighlights: text("menu_highlights").array(),
  coffeeQuality: varchar("coffee_quality"), // "specialty" | "good" | "basic"
  priceLevel: integer("price_level").default(2), // 1=£, 2=££, 3=£££
  
  // Accessibility & friendliness
  stepFree: boolean("step_free").default(false),
  accessibleToilet: boolean("accessible_toilet").default(false),
  dogFriendly: boolean("dog_friendly").default(false),
  kidsFriendly: boolean("kids_friendly").default(false),
  rainPlan: boolean("rain_plan").default(false), // can seat group inside if rains
  
  // Photos
  heroImage: text("hero_image"),
  galleryImages: text("gallery_images").array(),
  
  // Ratings (aggregates)
  ratingCoffee: real("rating_coffee").default(0),
  ratingFood: real("rating_food").default(0),
  ratingValue: real("rating_value").default(0),
  ratingBikeFriendly: real("rating_bike_friendly").default(0),
  ratingGroupFriendly: real("rating_group_friendly").default(0),
  ratingOverall: real("rating_overall").default(0),
  ratingCount: integer("rating_count").default(0),
  
  // Moderation
  verified: boolean("verified").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
  userId: varchar("user_id").references(() => users.id),
  
  // Legacy compatibility (keep for existing data)
  imageUrl: text("image_url"),
  hasBikeRacks: boolean("has_bike_racks").default(false),
  seatingCapacity: integer("seating_capacity"),
  isOpen: boolean("is_open").default(true),
  menuItems: text("menu_items").array(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cafeId: varchar("cafe_id").notNull().references(() => cafes.id),
  userId: varchar("user_id").references(() => users.id),
  userName: text("user_name").notNull(),
  userAvatar: text("user_avatar"),
  
  // Multi-dimensional ratings (optional, fallback to legacy rating)
  ratingCoffee: integer("rating_coffee"),
  ratingFood: integer("rating_food"),
  ratingValue: integer("rating_value"),
  ratingBikeFriendly: integer("rating_bike_friendly"),
  ratingGroupFriendly: integer("rating_group_friendly"),
  ratingOverall: integer("rating_overall"),
  
  comment: text("comment").notNull(),
  photos: text("photos").array(),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Legacy (keep for compatibility)
  rating: integer("rating").notNull(),
});

export const insertCafeSchema = createInsertSchema(cafes).omit({
  id: true,
  lastUpdated: true,
  ratingCoffee: true,
  ratingFood: true,
  ratingValue: true,
  ratingBikeFriendly: true,
  ratingGroupFriendly: true,
  ratingOverall: true,
  ratingCount: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type InsertCafe = z.infer<typeof insertCafeSchema>;
export type Cafe = typeof cafes.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
