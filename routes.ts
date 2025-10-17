import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCafeSchema, insertReviewSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication (must be called before defining routes)
  await setupAuth(app);

  // Auth route - get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get all cafés or filter by amenities
  app.get("/api/cafes", async (req, res) => {
    try {
      const { hasBikeRacks, hasWaterRefill, hasOutdoorSeating, search } = req.query;

      let cafes;
      
      if (search && typeof search === 'string') {
        cafes = await storage.searchCafes(search);
      } else if (hasBikeRacks || hasWaterRefill || hasOutdoorSeating) {
        cafes = await storage.filterCafes({
          hasBikeRacks: hasBikeRacks === 'true',
          hasWaterRefill: hasWaterRefill === 'true',
          hasOutdoorSeating: hasOutdoorSeating === 'true',
        });
      } else {
        cafes = await storage.getAllCafes();
      }

      res.json(cafes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cafés" });
    }
  });

  // Get a specific café
  app.get("/api/cafes/:id", async (req, res) => {
    try {
      const cafe = await storage.getCafe(req.params.id);
      if (!cafe) {
        return res.status(404).json({ error: "Café not found" });
      }
      res.json(cafe);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch café" });
    }
  });

  // Get reviews for a café
  app.get("/api/cafes/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByCafeId(req.params.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Create a new café (requires authentication)
  app.post("/api/cafes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCafeSchema.parse(req.body);
      const cafe = await storage.createCafe({
        ...validatedData,
        userId,
      });
      res.status(201).json(cafe);
    } catch (error: any) {
      console.error("Error creating café:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      res.status(500).json({ error: "Failed to create café" });
    }
  });

  // Create a review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
