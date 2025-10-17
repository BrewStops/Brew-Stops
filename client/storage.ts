import { type Cafe, type InsertCafe, type Review, type InsertReview, type User, type UpsertUser, cafes, reviews, users } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations - MANDATORY for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Café operations
  getCafe(id: string): Promise<Cafe | undefined>;
  getAllCafes(): Promise<Cafe[]>;
  searchCafes(query: string): Promise<Cafe[]>;
  filterCafes(filters: { hasBikeRacks?: boolean; hasWaterRefill?: boolean; hasOutdoorSeating?: boolean }): Promise<Cafe[]>;
  createCafe(cafe: InsertCafe): Promise<Cafe>;
  
  // Review operations
  getReviewsByCafeId(cafeId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  private seeded = false;

  // User operations - MANDATORY for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getCafe(id: string): Promise<Cafe | undefined> {
    await this.seedData();
    const [cafe] = await db.select().from(cafes).where(eq(cafes.id, id));
    return cafe;
  }

  async getAllCafes(): Promise<Cafe[]> {
    await this.seedData();
    return await db.select().from(cafes);
  }

  async searchCafes(query: string): Promise<Cafe[]> {
    await this.seedData();
    return await db.select().from(cafes).where(
      or(
        ilike(cafes.name, `%${query}%`),
        ilike(cafes.address, `%${query}%`),
        ilike(cafes.description, `%${query}%`)
      )
    );
  }

  async filterCafes(filters: {
    hasBikeRacks?: boolean;
    hasWaterRefill?: boolean;
    hasOutdoorSeating?: boolean;
  }): Promise<Cafe[]> {
    await this.seedData();
    const conditions = [];
    
    if (filters.hasBikeRacks !== undefined) {
      conditions.push(eq(cafes.hasBikeRacks, filters.hasBikeRacks));
    }
    if (filters.hasWaterRefill !== undefined) {
      conditions.push(eq(cafes.hasWaterRefill, filters.hasWaterRefill));
    }
    if (filters.hasOutdoorSeating !== undefined) {
      conditions.push(eq(cafes.hasOutdoorSeating, filters.hasOutdoorSeating));
    }

    if (conditions.length === 0) {
      return await db.select().from(cafes);
    }

    return await db.select().from(cafes).where(and(...conditions));
  }

  async createCafe(insertCafe: InsertCafe): Promise<Cafe> {
    const [cafe] = await db.insert(cafes).values(insertCafe).returning();
    return cafe;
  }

  async getReviewsByCafeId(cafeId: string): Promise<Review[]> {
    await this.seedData();
    return await db.select().from(reviews).where(eq(reviews.cafeId, cafeId));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  private async seedData() {
    if (this.seeded) return;

    // Check if we already have cafes in the database
    const existingCafes = await db.select().from(cafes).limit(1);
    if (existingCafes.length > 0) {
      this.seeded = true;
      return;
    }

    // Seed initial café data
    const cafesData: InsertCafe[] = [
      {
        name: "Café Latte",
        address: "123 Main St",
        latitude: 40.7128,
        longitude: -74.0060,
        description: "Cozy neighborhood café with excellent espresso and fresh pastries.",
        hasBikeRacks: true,
        hasWaterRefill: false,
        hasOutdoorSeating: true,
        seatingCapacity: 25,
        isOpen: true,
        menuItems: ["Coffee", "Pastries", "Sandwiches"],
      },
      {
        name: "Oakwood Café",
        address: "456 Park Ave",
        latitude: 40.7580,
        longitude: -73.9855,
        description: "Cyclist-friendly café with a beautiful garden seating area.",
        hasBikeRacks: true,
        hasWaterRefill: true,
        hasOutdoorSeating: true,
        seatingCapacity: 40,
        isOpen: true,
        menuItems: ["Coffee", "Smoothies", "Salads", "Bagels"],
      },
      {
        name: "Riverbank Coffee",
        address: "789 River Rd",
        latitude: 40.7489,
        longitude: -73.9680,
        description: "Riverside café with scenic views and bike-friendly amenities.",
        hasBikeRacks: true,
        hasWaterRefill: false,
        hasOutdoorSeating: true,
        seatingCapacity: 30,
        isOpen: true,
        menuItems: ["Coffee", "Pastries", "Breakfast"],
      },
      {
        name: "Green Bean Café",
        address: "321 Elm Street",
        latitude: 40.7350,
        longitude: -73.9950,
        description: "Eco-friendly café serving organic coffee and plant-based treats.",
        hasBikeRacks: true,
        hasWaterRefill: true,
        hasOutdoorSeating: false,
        seatingCapacity: 20,
        isOpen: true,
        menuItems: ["Organic Coffee", "Vegan Pastries", "Smoothie Bowls"],
      },
      {
        name: "The Cycling Stop",
        address: "555 Bike Lane",
        latitude: 40.7200,
        longitude: -74.0100,
        description: "Built by cyclists, for cyclists. Full bike repair station on-site!",
        hasBikeRacks: true,
        hasWaterRefill: true,
        hasOutdoorSeating: true,
        seatingCapacity: 35,
        isOpen: true,
        menuItems: ["Energy Drinks", "Protein Bars", "Fresh Juice", "Coffee"],
      },
    ];

    const insertedCafes = await db.insert(cafes).values(cafesData).returning();

    // Seed reviews
    const reviewsData: InsertReview[] = [
      {
        cafeId: insertedCafes[0].id,
        userName: "Emma J.",
        rating: 5,
        comment: "Best coffee on my morning route! The baristas are super friendly.",
      },
      {
        cafeId: insertedCafes[0].id,
        userName: "Alex P.",
        rating: 4,
        comment: "Great pastries and good bike parking. Can get busy on weekends.",
      },
      {
        cafeId: insertedCafes[1].id,
        userName: "Tom R.",
        rating: 5,
        comment: "Love the outdoor seating area! Perfect stop after a long ride.",
      },
      {
        cafeId: insertedCafes[1].id,
        userName: "Sarah M.",
        rating: 5,
        comment: "The water refill station is a lifesaver. Great smoothies too!",
      },
      {
        cafeId: insertedCafes[2].id,
        userName: "Lisa M.",
        rating: 4,
        comment: "Beautiful location by the river. Coffee is solid.",
      },
      {
        cafeId: insertedCafes[3].id,
        userName: "Mike T.",
        rating: 5,
        comment: "Best vegan options in the area. The staff really cares about sustainability.",
      },
      {
        cafeId: insertedCafes[4].id,
        userName: "Chris B.",
        rating: 5,
        comment: "This place is a game-changer! Fixed my chain while enjoying coffee.",
      },
    ];

    await db.insert(reviews).values(reviewsData);
    this.seeded = true;
  }
}

export const storage = new DatabaseStorage();
