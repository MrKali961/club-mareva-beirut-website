/**
 * Centralized SEO configuration for Club Mareva Beirut.
 *
 * Single source of truth for the canonical site URL, brand metadata, business
 * NAP (name/address/phone) details, and JSON-LD structured-data builders.
 *
 * IMPORTANT: The canonical domain is the NON-www apex domain. Every URL emitted
 * by metadata, the sitemap, robots, and structured data must use SITE_URL so
 * Google indexes a single canonical host. The www variant 301-redirects to it
 * (see next.config.ts).
 */

export const SITE_URL = "https://clubmarevabeirut.com";
export const SITE_NAME = "Club Mareva Beirut";
export const SITE_DESCRIPTION =
  "A sanctuary that ignites the senses. Premium cigars, rare whiskies, and exclusive events in Jal El Dib Seaside, Beirut, Lebanon.";

export const BUSINESS = {
  name: SITE_NAME,
  legalName: "Club Mareva Beirut",
  slogan: "A sanctuary that ignites the senses",
  email: "info@clubmarevabeirut.com",
  telephones: ["+96179117997", "+96181638731"],
  priceRange: "$$$",
  // Coordinates from the Google Maps embed on the contact page.
  geo: { latitude: 33.9077446, longitude: 35.5767838 },
  address: {
    streetAddress: "Jal El Dib Seaside",
    addressLocality: "Jal el Dib",
    addressRegion: "Mount Lebanon",
    addressCountry: "LB",
  },
  mapUrl: "https://maps.app.goo.gl/RCXy9Fkz9CC7ciux7",
  sameAs: [
    "https://instagram.com/clubmarevabeirut",
    "https://facebook.com/clubmarevabeirut",
  ],
  // Mon–Sat 11:00–23:00, Sun 17:00–23:00
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "11:00",
      closes: "23:00",
    },
    { days: ["Sunday"], opens: "17:00", closes: "23:00" },
  ],
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const LOGO_URL = absoluteUrl("/images/club-mareva-logo-gold.svg");

/**
 * LocalBusiness (BarOrPub) structured data — rendered site-wide in the root
 * layout. Powers Google's local/knowledge-panel rich results.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    slogan: BUSINESS.slogan,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: absoluteUrl("/opengraph-image"),
    logo: LOGO_URL,
    telephone: BUSINESS.telephones[0],
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: "USD, LBP",
    servesCuisine: "Cigars, Whisky, Fine Spirits",
    hasMap: BUSINESS.mapUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      addressCountry: BUSINESS.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    openingHoursSpecification: BUSINESS.openingHours.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.days,
      opens: spec.opens,
      closes: spec.closes,
    })),
    sameAs: BUSINESS.sameAs,
  };
}

/** WebSite structured data — declares the site name for SERP display. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}

/** BreadcrumbList structured data for a trail of {name, path} items. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Event structured data — eligible for Google event rich results. */
export function eventJsonLd(params: {
  name: string;
  description: string;
  startDate: string;
  url: string;
  image?: string;
  isPast?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: params.name,
    description: params.description,
    startDate: params.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: absoluteUrl(params.url),
    ...(params.image ? { image: [params.image] } : {}),
    location: {
      "@type": "Place",
      name: SITE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.streetAddress,
        addressLocality: BUSINESS.address.addressLocality,
        addressRegion: BUSINESS.address.addressRegion,
        addressCountry: BUSINESS.address.addressCountry,
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** Article (BlogPosting) structured data for news posts. */
export function articleJsonLd(params: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.title,
    description: params.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(params.url) },
    url: absoluteUrl(params.url),
    ...(params.image ? { image: [params.image] } : {}),
    ...(params.datePublished ? { datePublished: params.datePublished } : {}),
    dateModified: params.dateModified || params.datePublished,
    author: {
      "@type": params.authorName ? "Person" : "Organization",
      name: params.authorName || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
  };
}
