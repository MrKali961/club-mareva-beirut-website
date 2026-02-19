export interface Brand {
  name: string;
  origin: string;
  established?: string;
  description: string;
  logo: string;
  hashtags?: string[];
  testimonial?: {
    quote: string;
    author: string;
    title: string;
  };
  website?: string;
}

interface ApiBrand {
  name: string;
  description: string;
  logoUrl: string;
}

interface BrandEnrichment {
  origin: string;
  established?: string;
  hashtags?: string[];
  testimonial?: {
    quote: string;
    author: string;
    title: string;
  };
  website?: string;
}

export const BRAND_ENRICHMENT: Record<string, BrandEnrichment> = {
  Habanos: {
    origin: 'Cuba',
    established: 'Est. 1994',
    hashtags: ['#CubanCigars', '#Habanos', '#ClubMareva'],
    testimonial: {
      quote:
        'The Cohiba Behike is simply unmatched. Club Mareva\u2019s selection and service made it an unforgettable experience.',
      author: 'Michel R.',
      title: 'Founding Member',
    },
    website: 'https://www.habanos.com',
  },
  Davidoff: {
    origin: 'Dominican Republic',
    established: 'Est. 1968',
    hashtags: ['#Davidoff', '#LuxuryCigars', '#Refinement'],
    testimonial: {
      quote:
        'For special occasions, nothing compares to a Davidoff. The presentation and quality at Club Mareva elevate the entire experience.',
      author: 'Antoine K.',
      title: 'Premium Member',
    },
    website: 'https://www.davidoff.com',
  },
  Caldwell: {
    origin: 'Various',
    established: 'Est. 2014',
    hashtags: ['#Caldwell', '#BoutiqueCigars', '#Innovation'],
    testimonial: {
      quote:
        "Caldwell's Eastern Standard is my go-to. The staff at Club Mareva always knows exactly what I'm looking for.",
      author: 'Georges M.',
      title: 'Regular Member',
    },
    website: 'https://caldwellcigars.com',
  },
  'Hiram & Solomon': {
    origin: 'Dominican Republic',
    established: 'Est. 2016',
    hashtags: ['#HiramAndSolomon', '#MasonicHeritage', '#Craftsmanship'],
    testimonial: {
      quote:
        'The Traveling Man is a masterpiece. Finding it at Club Mareva was a revelation\u2014truly a hidden gem.',
      author: 'Fadi S.',
      title: 'Cigar Enthusiast',
    },
    website: 'https://www.hiramandsolomoncigars.com',
  },
  Patoro: {
    origin: 'Dominican Republic',
    established: 'Est. 2005',
    hashtags: ['#Patoro', '#CubanSeed', '#Elegance'],
    testimonial: {
      quote:
        "Patoro's Gran A\u00f1ejo is pure silk. The humidor at Club Mareva keeps them in perfect condition.",
      author: 'Karim H.',
      title: 'Connoisseur',
    },
    website: 'https://www.patoro.com',
  },
  'Drew Estate': {
    origin: 'Nicaragua',
    established: 'Est. 1996',
    hashtags: ['#DrewEstate', '#LigaPrivada', '#BoldFlavors'],
    testimonial: {
      quote:
        'The Liga Privada No. 9 paired with aged rum\u2014pure magic. Club Mareva\u2019s pairing suggestions are always spot-on.',
      author: 'Ziad B.',
      title: 'Regular Guest',
    },
    website: 'https://drewestate.com',
  },
  'Rocky Patel': {
    origin: 'Nicaragua/Honduras',
    established: 'Est. 1996',
    hashtags: ['#RockyPatel', '#PremiumCigars', '#BoldFlavors'],
    testimonial: {
      quote:
        'The Decade is my daily companion. Consistent, reliable, and always available at Club Mareva.',
      author: 'Nabil F.',
      title: 'Daily Visitor',
    },
    website: 'https://rockypatel.com',
  },
  Casdagli: {
    origin: 'Dominican/Costa Rica',
    established: 'Est. 2014',
    hashtags: ['#Casdagli', '#BritishHeritage', '#Refined'],
    testimonial: {
      quote:
        "Casdagli's Daughters of the Wind is exceptional. Club Mareva introduced me to this brand\u2014forever grateful.",
      author: 'Jean-Pierre L.',
      title: 'Member Since 2020',
    },
    website: 'https://www.casdaglicigars.com',
  },
  Saga: {
    origin: 'Dominican Republic',
    established: 'Est. 2016',
    hashtags: ['#SagaCigars', '#ExceptionalValue', '#Quality'],
    testimonial: {
      quote: 'Perfect for a quick smoke break. Saga delivers quality at an accessible price point.',
      author: 'Sami T.',
      title: 'Regular Guest',
    },
    website: 'https://www.sagacigars.com',
  },
  'Smoking Jacket': {
    origin: 'Dominican Republic',
    established: 'Est. 2018',
    hashtags: ['#SmokingJacket', '#ModernBoutique', '#Innovation'],
    testimonial: {
      quote:
        "Hendrik Jr.'s vision shines through every blend. A must-try for any serious aficionado.",
      author: 'Rami D.',
      title: 'Cigar Collector',
    },
    website: 'https://www.smokingcigarjacket.com',
  },
};

export function apiBrandToLocalBrand(apiBrand: ApiBrand): Brand {
  const enrichment = BRAND_ENRICHMENT[apiBrand.name] ?? { origin: 'Unknown' };

  return {
    name: apiBrand.name,
    origin: enrichment.origin,
    established: enrichment.established,
    description: apiBrand.description,
    logo: apiBrand.logoUrl,
    hashtags: enrichment.hashtags,
    testimonial: enrichment.testimonial,
    website: enrichment.website,
  };
}

export function apiBrandToShowcaseBrand(apiBrand: ApiBrand): { name: string; logo: string } {
  return {
    name: apiBrand.name,
    logo: apiBrand.logoUrl,
  };
}
