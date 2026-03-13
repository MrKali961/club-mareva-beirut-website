// Common pagination wrapper from API responses
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// News Article (maps to existing Post interface via adapter)
export interface ApiNewsArticle {
  id: string;
  title: string;
  slug: string;
  date: string;
  mainImageUrl?: string;
  body: string;
  isFeatured: boolean;
  image?: {
    url: string;
    alt: string;
  };
  imageUrls?: {
    original: string | null;
    medium: string | null;
    thumb: string | null;
  };
  // Gallery images — present on detail endpoint (/news/:slug), absent on list
  galleryImages?: Array<{
    id: string;
    mediaAssetId: string;
    displayOrder: number;
    createdAt: string;
    imageUrls: {
      original: string;
      medium: string;
      thumb: string;
    };
  }>;
  galleryLayout?: Array<{
    id: string;
    type: string;
    imageIds: string[];
  }> | null;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImageAlt?: string | null;
}

// Event
export interface ApiEvent {
  id: string;
  title: string;
  slug: string;
  date: string;
  location?: string;
  mainImageUrl?: string;
  body: string;
  isFeatured: boolean;
  maxVisitors?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImageAlt?: string | null;
  image?: {
    url: string;
    alt: string;
  };
  imageUrls?: {
    original: string | null;
    medium: string | null;
    thumb: string | null;
  };
  galleryImages?: Array<{
    id: string;
    mediaAssetId: string;
    displayOrder: number;
    createdAt: string;
    imageUrls: {
      original: string;
      medium: string;
      thumb: string;
    };
  }>;
  galleryLayout?: Array<{
    id: string;
    type: string;
    imageIds: string[];
  }> | null;
}

// Cigar Brand
export interface ApiCigarBrand {
  id: string;
  title: string;
  description: string | null;
  isFeatured: boolean;
  displayOrder: number;
  logoUrls: {
    original: string | null;
    medium: string | null;
    thumb: string | null;
  };
}

// Contact form submission
export interface ApiContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

// Event registration
export interface ApiEventRegistration {
  name: string;
  email: string;
  phone: string;
  numberOfGuests: number;
}

// Cigars list response (non-standard pagination shape from /cigars endpoint)
export interface CigarListResponse {
  cigars: ApiCigar[];
  total: number;
  page: number;
  limit: number;
}

// Cigar (individual product)
export interface ApiCigar {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  brand?: { id: string; title: string };
  origin?: string;
  wrapper?: string;
  binder?: string;
  filler?: string;
  strength?: string;
  flavor?: string;
  price?: string;
  retailPrice?: string;
  rating?: number;
  ringGauge?: number;
  length?: number;
  grams?: number;
  cigarsPerBox?: number;
  isPublished: boolean;
  image?: { url: string; alt: string };
  createdAt: string;
  updatedAt: string;
}

// Alcohol product
export interface ApiAlcohol {
  id: string;
  name: string;
  slug: string;
  category?: string;
  brand?: string;
  type?: string;
  country?: string;
  region?: string;
  age?: string;
  volume?: string;
  alcoholLevel?: string;
  price?: string;
  flavor?: string;
  inHouse: boolean;
  isPublished: boolean;
  image?: { url: string; alt: string };
}

// Cigar accessory
export interface ApiAccessory {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  category?: string;
  itemNumber?: string;
  description?: string;
  price?: string;
  isPublished: boolean;
  image?: { url: string; alt: string };
}

// Menu item
export interface ApiMenuItem {
  id: string;
  familyId?: string | null;
  name: string;
  displayName: string;
  slug: string;
  description?: string;
  price?: string;
  abv?: string;
  details?: string;
  displayOrder: number;
  imageUrls: {
    original: string | null;
    medium: string | null;
    thumb: string | null;
  };
}

// Menu group (family or standalone items)
export interface ApiMenuGroup {
  type: 'family' | 'standalone';
  family?: { id: string; name: string };
  items: ApiMenuItem[];
}

// Reservation settings (public)
export interface ApiReservationSettings {
  isEnabled: boolean;
  maxGuestsPerBooking: number;
  advanceBookingDays: number;
  timeSlots: string[];
  closedDays: number[];
  operatingHours: Record<string, { open: string; close: string }> | null;
  slotDurationMinutes: number;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDescription: string;
  tables: { id: string; name: string; capacity: number; label: string | null }[];
}

// Table availability response for a specific date+time
export interface ApiTableAvailability {
  available: boolean;
  tables: {
    id: string;
    name: string;
    capacity: number;
    label: string | null;
    available: boolean;
  }[];
  message?: string;
}

// Availability response for a specific date
export interface ApiAvailability {
  available: boolean;
  timeSlots?: { time: string; available: boolean; remainingSlots: number }[];
  maxGuests?: number;
  message?: string;
}

// Reservation creation result
export interface ApiReservationResult {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  numberOfGuests: number;
  tableId: string;
  status: string;
  confirmationMessage: string;
}

// Menu section (with grouped items)
export interface ApiMenuSection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  groups: ApiMenuGroup[];
}
