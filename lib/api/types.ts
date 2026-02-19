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
  createdAt: string;
  updatedAt: string;
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
  image?: {
    url: string;
    alt: string;
  };
}

// Cigar Brand
export interface ApiCigarBrand {
  id: string;
  title: string;
  description: string;
  logoUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  logo?: {
    url: string;
    alt: string;
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
}
