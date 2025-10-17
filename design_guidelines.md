# Cycle Cafés - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern mobile-first applications like Airbnb (for location-based discovery), Strava (for cycling community), and Apple Maps (for navigation integration). The design emphasizes clean, accessible interfaces with a cycling-friendly aesthetic.

## Core Design Principles
- **Mobile-First**: Prioritize mobile experience with touch-friendly interactions
- **Scannable Information**: Quick access to key café details and amenities
- **Welcoming Aesthetic**: Soft, approachable visual language that reflects cycling culture
- **Location-Centric**: Map and distance information as primary navigation tools

## Color Palette

### Light Mode (Primary)
- **Background**: 42 15% 96% (warm cream/off-white)
- **Primary Brand**: 145 25% 45% (sage green - cycling/nature theme)
- **Accent**: 15 65% 60% (terracotta - warm, inviting)
- **Text Primary**: 0 0% 20% (charcoal)
- **Text Secondary**: 0 0% 45% (medium gray)
- **Surface**: 0 0% 100% (white cards)
- **Border**: 0 0% 88% (light gray dividers)

### Dark Mode
- **Background**: 220 15% 12% (deep blue-gray)
- **Primary Brand**: 145 30% 55% (lighter sage)
- **Accent**: 15 70% 65% (lighter terracotta)
- **Text Primary**: 0 0% 95% (off-white)
- **Text Secondary**: 0 0% 70% (light gray)
- **Surface**: 220 15% 18% (elevated cards)

## Typography
- **Primary Font**: Inter or similar modern sans-serif via Google Fonts
- **Headings**: 600-700 weight, tight line-height (1.1-1.2)
- **Body Text**: 400 weight, comfortable reading (1.5-1.6 line-height)
- **UI Elements**: 500 weight for buttons and labels
- **Scale**: 14px (mobile body), 16px (desktop body), 24-32px (headings)

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Mobile padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card padding: p-4 to p-6
- Icon/text gaps: gap-2 to gap-3

**Container Strategy**:
- Mobile: Full-width with px-4 side padding
- Desktop: max-w-7xl centered with generous side padding
- Cards: Rounded corners (rounded-2xl), subtle shadows

## Component Library

### Navigation
- **Bottom Tab Bar (Mobile)**: Fixed position with 4-5 primary actions (Home, Search, Map, Favorites, Profile)
- **Top Bar**: Minimal with logo/title and secondary actions (filters, settings)
- **Icons**: Heroicons or similar clean icon set

### Search & Filters
- **Search Bar**: Prominent, rounded pill-style with search icon
- **Filter Pills**: Horizontal scrollable chips for amenities (bike racks, water refill, outdoor seating)
- **Active State**: Sage green background for selected filters

### Café Cards
- **Layout**: Image/icon on left, details on right
- **Distance Badge**: Small pill showing km/miles in terracotta
- **Status Indicator**: "Open Now" in green or "Closed" in red/gray
- **Amenity Icons**: Small icons for bike racks, WiFi, outdoor seating below title
- **Compact**: 80-100px height for list view

### Map View
- **Custom Markers**: Cycling-themed pin with café icon
- **Selected State**: Larger, highlighted marker with terracotta accent
- **Info Cards**: Bottom sheet or popup with café preview
- **Toggle**: Easy switch between list and map views

### Detail View
- **Hero Image**: Full-width café photo if available
- **Info Grid**: 2-column layout for capacity, hours, features
- **Menu Section**: Scrollable highlights or categories
- **Reviews**: Card-based with user avatar, rating, and comment
- **CTA Button**: Large, sage green "Add to Favorites" or "Get Directions"

### Interactive Elements
- **Primary Buttons**: Solid sage green, white text, rounded-xl
- **Secondary Buttons**: Outline with sage green border
- **Icon Buttons**: Circular or square with light background
- **Favorites**: Heart icon that fills with terracotta when active

## Images
**Hero/Featured Images**: 
- Café listings should include warm, inviting photos of café interiors/exteriors when available
- Fallback: Illustrated cycling/café themed graphics in brand colors
- Aspect ratio: 16:9 or 3:2 for hero images, 1:1 for thumbnails

**Image Placement**:
- Café cards: Left-aligned thumbnail (60-80px square)
- Detail pages: Full-width hero at top (300-400px height mobile)
- Map markers: Icon-based, no photos

## Animations
**Minimal & Purposeful**:
- Smooth transitions between views (200-300ms)
- Gentle bounce/scale on favorite toggle
- Subtle shadow elevation on card press
- Map marker animations when selecting café
- No auto-playing animations or excessive motion

## Mobile-Specific Patterns
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Swipe Gestures**: Swipe to reveal favorites or delete (if needed in future)
- **Pull to Refresh**: Standard mobile pattern for café list updates
- **Bottom Sheets**: For filters and quick actions instead of modals
- **Safe Areas**: Respect notch and home indicator spacing

## Accessibility
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Focus indicators: Visible outline for keyboard navigation
- Alt text: All images and icons with descriptive labels
- Touch targets: 44px minimum for easy tapping
- Dark mode: Consistent implementation across all screens