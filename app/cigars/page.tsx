import { fetchCigarBrands } from '@/lib/api/brands';
import { apiBrandToLocalBrand, type Brand } from '@/lib/adapters/brands-adapter';
import CigarsClient from './CigarsClient';

export const revalidate = 3600; // 1 hour

const FALLBACK_BRANDS: Brand[] = [
  {
    name: "Habanos",
    origin: "Cuba",
    established: "Est. 1994",
    description: "Habanos S.A is a highly reputable and renowned Cuban manufacturing company that was founded in 1994. As the official government-run tobacco company of Cuba, Habanos S.A is responsible for controlling the promotion, distribution, and export of premium Cuban cigars worldwide. The name \"Habanos\" itself is derived from the Spanish term for Havana, the capital city of Cuba. In essence, the company's name pays homage to the city where Cuban cigars have been traditionally produced since the 16th century. Habanos S.A is well known for producing some of the most highly-regarded and sought-after premium cigar brands in the world, including Cohiba, Montecristo, and Romeo y Julieta. These brands are considered to be some of the finest examples of the cigar-making craft and are highly valued by cigar enthusiasts worldwide. With a deep-rooted history and legacy that spans centuries, Habanos S.A has become synonymous with premium cigar culture and is highly regarded as a symbol of luxury and refinement. The company's unwavering commitment to quality, tradition, and innovation has made it one of the most respected and influential players in the global cigar industry.",
    logo: "/images/external/habanos-sa-logo-vector.png",
    hashtags: ["#CubanCigars", "#Habanos", "#ClubMareva"],
    testimonial: {
      quote: "The Cohiba Behike is simply unmatched. Club Mareva\u2019s selection and service made it an unforgettable experience.",
      author: "Michel R.",
      title: "Founding Member"
    },
    website: "https://www.habanos.com"
  },
  {
    name: "Davidoff",
    origin: "Dominican Republic",
    established: "Est. 1968",
    description: "In their single-minded pursuit to create only the very best cigars, Davidoff believes in the importance of time. Taking precious time to craft an exceptional cigar, and equally taking the time to enjoy that cigar, lies at the very heart of Davidoff's philosophy. Davidoff cigars are widely regarded as a top-shelf luxury selection. Handmade in the Dominican Republic, Davidoff offers a burgeoning portfolio of premium blends with a distinctly mellow and approachable profile. Each cigar is flawlessly constructed with enticing flavors connoisseurs choose for their rich signature of cedar, coffee and nuts and their smooth and creamy finishes.",
    logo: "/images/external/davidoff_cigars_logo.png",
    hashtags: ["#Davidoff", "#LuxuryCigars", "#Refinement"],
    testimonial: {
      quote: "For special occasions, nothing compares to a Davidoff. The presentation and quality at Club Mareva elevate the entire experience.",
      author: "Antoine K.",
      title: "Premium Member"
    },
    website: "https://www.davidoff.com"
  },
  {
    name: "Caldwell",
    origin: "Various",
    established: "Est. 2014",
    description: "All of Caldwell's creations are unique, but they all share that signature, expert Caldwell care\u2014 expertly aged tobaccos, complex blends, and top-notch construction that keeps the flavor consistently good and delicious right down to the nub on each stick. Caldwell has grown a considerable portfolio of diverse offerings, and they have a blend to suit just about any palate preference. Eastern Standard is an interesting take on Connecticut blends, using vintage Dominican and Nicaraguan Cuban-seed tobaccos under a top-shelf hybrid wrapper that is a cross between Connecticut Shade and Brazilian Mata Fina varietals.",
    logo: "/images/external/7085500fef0c5d55f740aa2b82a20d69_Caldwell-Cigar-Co-logo.jpg",
    hashtags: ["#Caldwell", "#BoutiqueCigars", "#Innovation"],
    testimonial: {
      quote: "Caldwell's Eastern Standard is my go-to. The staff at Club Mareva always knows exactly what I'm looking for.",
      author: "Georges M.",
      title: "Regular Member"
    },
    website: "https://caldwellcigars.com"
  },
  {
    name: "Hiram & Solomon",
    origin: "Dominican Republic",
    established: "Est. 2016",
    description: "Hiram & Solomon Cigars are all about bringing Mason brothers together in the harmony of a good cigar. In the beginning, WB Kashouty and Brother George Dakrat, the founders of Hiram & Solomon, established their first location in the beauty of the Dominican Republic, before moving shortly after to Nicaragua, harvesting shockingly delicious and full-bodied tobacco to rival the flavors and quality of the world's best cigar brands.",
    logo: "/images/external/hiram-solomon.png",
    hashtags: ["#HiramAndSolomon", "#MasonicHeritage", "#Craftsmanship"],
    testimonial: {
      quote: "The Traveling Man is a masterpiece. Finding it at Club Mareva was a revelation\u2014truly a hidden gem.",
      author: "Fadi S.",
      title: "Cigar Enthusiast"
    },
    website: "https://www.hiramandsolomoncigars.com"
  },
  {
    name: "Patoro",
    origin: "Dominican Republic",
    established: "Est. 2005",
    description: "The main goal of Patrik J. Martin when he created his brand Patoro in 2001 was and still is to offer cigar aficionados positive emotions during moments of intense pleasure, enjoyment and relaxation thanks to the excellence of his cigars. While the tobacco used in Patoro cigars is grown on the best soils of the Dominican Republic, the seeds are essentially of Cuban origin and the result of long development and research.",
    logo: "/images/external/logo-patoro.png",
    hashtags: ["#Patoro", "#CubanSeed", "#Elegance"],
    testimonial: {
      quote: "Patoro's Gran A\u00f1ejo is pure silk. The humidor at Club Mareva keeps them in perfect condition.",
      author: "Karim H.",
      title: "Connoisseur"
    },
    website: "https://www.patoro.com"
  },
  {
    name: "Drew Estate",
    origin: "Nicaragua",
    established: "Est. 1996",
    description: "Jonathan Drew first entered the industry when he began selling cigars from a small kiosk in New York City's World Trade Center in 1995. The following year, his former fraternity brother Marvin Samel would join him, and the pair would go on to found Drew Estate Inc. Drew Estate would find success in the premium cigar industry when it released Liga Privada in 2007, followed by brands such as Undercrown, Herrera Esteli and Norte\u00f1o. The company has grown into the largest producer of handmade cigars in Nicaragua, where its modern La Gran Fabrica Drew Estate factory is located. Liga Privada means \"private blend.\" Seven different tobaccos from seven distinct vegas are included. Wrapper is hand fermented for 18+ months, no sweat allowed. Only four pairs within our factory are certified to produce. Each pair is allowed to craft only 250 cigars per day. Cigars are aged a full year before being offered for sale. Very limited production.",
    logo: "/images/external/drew-estate-logo.svg",
    hashtags: ["#DrewEstate", "#LigaPrivada", "#BoldFlavors"],
    testimonial: {
      quote: "The Liga Privada No. 9 paired with aged rum\u2014pure magic. Club Mareva\u2019s pairing suggestions are always spot-on.",
      author: "Ziad B.",
      title: "Regular Guest"
    },
    website: "https://drewestate.com"
  },
  {
    name: "Rocky Patel",
    origin: "Nicaragua/Honduras",
    established: "Est. 1996",
    description: "Charismatic cigar-maker Rocky Patel blends a popular and ever-growing portfolio of top-rated cigars. The 95-rated Rocky Patel Decade, 94-rated Rocky Patel, The Edge Habano, and 90-rated Rocky Patel Renaissance represent just a few of his most prominent releases. Rocky Patel cigars are handcrafted in Nicaragua and Honduras from a wide diversity of premium long-filler tobaccos and well-known wrapper varieties, including Connecticut Shade, Ecuador Habano, Connecticut Broadleaf, San Andr\u00e9s, and more.",
    logo: "/images/external/rocky-patel-logo.png",
    hashtags: ["#RockyPatel", "#PremiumCigars", "#BoldFlavors"],
    testimonial: {
      quote: "The Decade is my daily companion. Consistent, reliable, and always available at Club Mareva.",
      author: "Nabil F.",
      title: "Daily Visitor"
    },
    website: "https://rockypatel.com"
  },
  {
    name: "Casdagli",
    origin: "Dominican/Costa Rica",
    established: "Est. 2014",
    description: "Casdagli Cigars was founded in 1997, but the history starts in the 1800s when the Casdagli family started trading grain, tobacco, cotton, and breeding of Arabian horses. The original production of Casdagli Cigars in 1990s was produced in Cuba, 100% hand rolled by the master torcedor Carlos Valdez Mosquera, but on Carlos's retirement in 2013 the search for a new trustworthy producer led to the discovery of the newly opened Kelner Boutique Factory in the Dominican Republic. One line of Casdagli cigars is made in Costa Rica: The Daughters of the Wind. These cigars are hand crafted in Costa Rica by Don Olman Guzman. These blends are dominated by the rich flavours emanating from Peru, Ecuador, and Nicaragua. \"The Daughters of the Wind\" is a famous Arabian poem written in the 6th century inspired by the beauty of Bedouin horses. In the early 1900s Demy & Alick Casdagli purchased the Sheikh Obeyd stables just outside Cairo and became celebrated breeders of Arabian racehorses. They gained success with breeding the Dahman strain with a famous mare called Bint Durra. \"The Dahman is a very rare breed famed for its strength, elegance and refinement.\"",
    logo: "/images/external/casdagli-cigars-logo.png",
    hashtags: ["#Casdagli", "#BritishHeritage", "#Refined"],
    testimonial: {
      quote: "Casdagli's Daughters of the Wind is exceptional. Club Mareva introduced me to this brand\u2014forever grateful.",
      author: "Jean-Pierre L.",
      title: "Member Since 2020"
    },
    website: "https://www.casdaglicigars.com"
  },
  {
    name: "Saga",
    origin: "Dominican Republic",
    established: "Est. 2016",
    description: "The Saga Cigars try to tell stories with their lines. In fact, the cigar boxes they come in look like very rustic books or tomes with each line holding a new 'chapter' of flavors. The Saga Short Tales are made at the De Los Reyes Cigars factory in the Dominican Republic and saw their debut in 2016 thanks to the young Nirka Reyes who took over her father's company recently.",
    logo: "/images/external/SAGA.png",
    hashtags: ["#SagaCigars", "#ExceptionalValue", "#Quality"],
    testimonial: {
      quote: "Perfect for a quick smoke break. Saga delivers quality at an accessible price point.",
      author: "Sami T.",
      title: "Regular Guest"
    },
    website: "https://www.sagacigars.com"
  },
  {
    name: "Smoking Jacket",
    origin: "Dominican Republic",
    established: "Est. 2018",
    description: "Influenced by legends in the cigar world, Hendrik Kelner always dreamed of opening an independently owned cigar factory, enabling him to create unique cigar blends with his own personal touch. After almost 20 years of working with his father Henke, Hendrik's dream, Kelner Boutique Factory (KBF), has finally become a reality and opened in San Jose, Costa Rica. Smoking Jacket is a new cigar brand released in the US market in September of 2013. Only 75 cigar stores will carry them as supply is extremely limited. The line consists of 4 cigar sizes, each with its own blend to offer a unique smoking experience.",
    logo: "/images/external/Smoking_Jacket_Cigars_logo.png",
    hashtags: ["#SmokingJacket", "#ModernBoutique", "#Innovation"],
    testimonial: {
      quote: "Hendrik Jr.'s vision shines through every blend. A must-try for any serious aficionado.",
      author: "Rami D.",
      title: "Cigar Collector"
    },
    website: "https://www.smokingcigarjacket.com"
  },
];

export default async function CigarsPage() {
  let brands: Brand[] = FALLBACK_BRANDS;

  try {
    const response = await fetchCigarBrands();
    if (response.items.length > 0) {
      brands = response.items.map(b => apiBrandToLocalBrand({
        name: b.title,
        description: b.description,
        logoUrl: b.logo?.url || b.logoUrl || '',
      }));
    }
  } catch (error) {
    console.error('Error fetching cigar brands, using fallback:', error);
  }

  return <CigarsClient brands={brands} />;
}
