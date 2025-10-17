# Brew Stops - Comprehensive Cyclist-Friendly Café Finder

## Overview

Brew Stops is a comprehensive mobile-first web application designed to help cyclists discover and find cyclist-friendly cafés along their routes. The application provides extensive location-based café discovery with detailed filtering by cyclist-specific amenities, group capacity, dietary options, and much more. Built with a modern React frontend and Express backend, the application features:

- **Real Maps**: Leaflet integration with OpenStreetMap tiles for accurate café locations
- **Geolocation**: Browser geolocation API for real-time user location tracking  
- **Authentication**: Replit Auth with Google, GitHub, and email/password login
- **Comprehensive Data**: 50+ café attributes including bike parking, facilities, dietary options, group capacity
- **Multi-dimensional Ratings**: Coffee, food, value, bike-friendliness, group-friendliness ratings

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Major Updates (October 2025)

- ✅ Upgraded to PostgreSQL with comprehensive schema (50+ café fields)
- ✅ Integrated Replit Auth for user authentication
- ✅ Replaced mock map with real Leaflet + OpenStreetMap
- ✅ Added browser geolocation for user location tracking
- ✅ Built comprehensive multi-section café submission form with 4 tabs
- ✅ Enhanced bike parking details (covered/open/inside, CCTV, lockable areas)
- ✅ Added group riding features (max group size, booking, queue tolerance, rain plan)
- ✅ Expanded dietary options (GF, vegan, vegetarian, dairy-free, nut-aware)
- ✅ Added service details (quick counter/table service/pre-order friendly)
- ✅ Implemented multi-dimensional rating system

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript running on Vite for development and build tooling.

**UI Component System**: Built on shadcn/ui components with Radix UI primitives, providing a comprehensive set of pre-built, accessible components. The design system uses the "new-york" style variant with full CSS variable customization.

**Styling Approach**: Tailwind CSS with a custom design system featuring:
- Mobile-first responsive design
- Custom color palette with light/dark mode support (sage green primary, terracotta accents)
- HSL color system with CSS variables for theming
- Inter font family for typography

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. Local state managed with React hooks.

**Routing**: Wouter for lightweight client-side routing with pages for Home, Map, Favorites, and Profile.

**Key Design Decisions**:
- Mobile-first approach with bottom navigation for primary UI
- Location-centric UX with map integration as a core feature
- Scannable café cards with quick access to amenity information
- Local storage for favorites functionality (no authentication required)

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with endpoints for café discovery, filtering, and reviews:
- `GET /api/cafes` - List/filter cafés with optional query parameters
- `GET /api/cafes/:id` - Retrieve specific café details
- `GET /api/cafes/:id/reviews` - Fetch reviews for a café
- `POST /api/cafes` - Create new café (admin functionality)
- `POST /api/cafes/:id/reviews` - Submit café review

**Data Layer**: In-memory storage implementation (`MemStorage`) as the current data persistence strategy. The storage interface (`IStorage`) is designed to be swappable, allowing future migration to database-backed storage without changing API contracts.

**Development Setup**: Vite middleware integration in development mode for HMR (Hot Module Reload) with custom logging and error handling.

**Key Design Decisions**:
- Storage abstraction layer allows switching from in-memory to database without API changes
- Middleware for request/response logging focused on API routes only
- Separation of route registration from server setup for modularity

### Data Schema

**Database ORM**: Drizzle ORM configured for PostgreSQL with the following schema:

**Cafes Table**:
- UUID primary key with auto-generation
- Location data (latitude, longitude, address)
- Amenity booleans (bike racks, water refill, outdoor seating)
- Metadata (name, description, image URL, menu items array)
- Operational status (isOpen, seatingCapacity)

**Reviews Table**:
- UUID primary key with auto-generation
- Foreign key reference to cafes table
- User information (userName, userAvatar)
- Rating (integer) and comment (text)

**Schema Validation**: Zod schemas derived from Drizzle tables for runtime validation using `drizzle-zod`.

**Key Design Decisions**:
- PostgreSQL dialect chosen for production readiness and JSON array support
- UUID primary keys for distributed system compatibility
- Menu items stored as text array for flexibility
- Separate reviews table maintains referential integrity

### External Dependencies

**Database Provider**: Neon serverless PostgreSQL (`@neondatabase/serverless`) - serverless-first PostgreSQL platform optimized for modern applications.

**UI Component Library**: 
- Radix UI primitives for accessible, unstyled components
- shadcn/ui for pre-built styled components
- Lucide React for iconography

**Form Handling**: React Hook Form with Hookform Resolvers for validation integration.

**Date Utilities**: date-fns for date manipulation and formatting.

**Build Tools**:
- Vite for frontend bundling and dev server
- esbuild for backend bundling in production
- tsx for TypeScript execution in development

**Styling**:
- Tailwind CSS for utility-first styling
- class-variance-authority for component variant management
- clsx/tailwind-merge for conditional class composition

**Development Tools**:
- Replit-specific plugins for development experience (cartographer, dev banner, runtime error overlay)

**Key Integration Points**:
- Environment variable `DATABASE_URL` required for database connection
- Drizzle Kit for schema migrations to PostgreSQL
- Session management via `connect-pg-simple` (configured but storage implementation uses in-memory)