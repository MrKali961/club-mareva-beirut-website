'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import VideoBackground from '@/components/ui/VideoBackground';
import Button from '@/components/ui/Button';

// Enhanced Brand Interface
interface Brand {
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

const brands: Brand[] = [
  {
    name: "Habanos",
    origin: "Cuba",
    established: "Est. 1994",
    description: "Habanos S.A is a highly reputable and renowned Cuban manufacturing company that was founded in 1994. As the official government-run tobacco company of Cuba, Habanos S.A is responsible for controlling the promotion, distribution, and export of premium Cuban cigars worldwide. The name \"Habanos\" itself is derived from the Spanish term for Havana, the capital city of Cuba. In essence, the company's name pays homage to the city where Cuban cigars have been traditionally produced since the 16th century. Habanos S.A is well known for producing some of the most highly-regarded and sought-after premium cigar brands in the world, including Cohiba, Montecristo, and Romeo y Julieta. These brands are considered to be some of the finest examples of the cigar-making craft and are highly valued by cigar enthusiasts worldwide. With a deep-rooted history and legacy that spans centuries, Habanos S.A has become synonymous with premium cigar culture and is highly regarded as a symbol of luxury and refinement. The company's unwavering commitment to quality, tradition, and innovation has made it one of the most respected and influential players in the global cigar industry.",
    logo: "/images/external/habanos-sa-logo-vector.png",
    hashtags: ["#CubanCigars", "#Habanos", "#ClubMareva"],
    testimonial: {
      quote: "The Cohiba Behike is simply unmatched. Club Mareva's selection and service made it an unforgettable experience.",
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
    logo: "/images/external/Hiram-Solomon-Logo.png",
    hashtags: ["#HiramAndSolomon", "#MasonicHeritage", "#Craftsmanship"],
    testimonial: {
      quote: "The Traveling Man is a masterpiece. Finding it at Club Mareva was a revelation—truly a hidden gem.",
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
    logo: "/images/external/patoro.jpg",
    hashtags: ["#Patoro", "#CubanSeed", "#Elegance"],
    testimonial: {
      quote: "Patoro's Gran Añejo is pure silk. The humidor at Club Mareva keeps them in perfect condition.",
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
      quote: "The Liga Privada No. 9 paired with aged rum—pure magic. Club Mareva's pairing suggestions are always spot-on.",
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
    logo: "/images/external/casdagli-logo.jpg",
    hashtags: ["#Casdagli", "#BritishHeritage", "#Refined"],
    testimonial: {
      quote: "Casdagli's Daughters of the Wind is exceptional. Club Mareva introduced me to this brand—forever grateful.",
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
    logo: "/images/external/saga-cigars.jpg",
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
    logo: "/images/external/smoking-jacket-logo.jpg",
    hashtags: ["#SmokingJacket", "#ModernBoutique", "#Innovation"],
    testimonial: {
      quote: "Hendrik Jr.'s vision shines through every blend. A must-try for any serious aficionado.",
      author: "Rami D.",
      title: "Cigar Collector"
    },
    website: "https://www.smokingcigarjacket.com"
  },
];

const philosophyPillars = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    title: "Heritage",
    description: "Our state-of-the-art Spanish cedar humidor maintains perfect conditions at 70% humidity and 70°F, preserving each cigar's character exactly as the master blenders intended."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: "Curation",
    description: "Every cigar in our collection is hand-selected from the world's premier growing regions—Cuba, Nicaragua, Dominican Republic, Honduras, and Costa Rica—representing over 220 varieties from legendary houses."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "Pairing",
    description: "Our knowledgeable staff are here to guide your journey, whether you seek a bold Nicaraguan to match your single malt or a refined Dominican for your evening cognac."
  }
];

// Social Icons Components
function HeartIcon({ filled, className = "" }: { filled?: boolean; className?: string }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CommentIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
    </svg>
  );
}

function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function BookmarkIcon({ filled, className = "" }: { filled?: boolean; className?: string }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  );
}

// Share Modal Component
function ShareModal({ brand, isOpen, onClose }: { brand: Brand; isOpen: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/cigars#${brand.name.toLowerCase().replace(/\s+/g, '-')}`
    : `/cigars#${brand.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Check out ${brand.name} cigars at Club Mareva Beirut! ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-black-800 border border-black-900 rounded-lg p-6 max-w-sm w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-gold font-playfair text-xl mb-4 text-center">Share {brand.name}</h3>

          <div className="space-y-3">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 p-3 bg-black-900 hover:bg-gold/10 border border-black-900 hover:border-gold/30 rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span className="text-cream text-sm">{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-3 p-3 bg-black-900 hover:bg-gold/10 border border-black-900 hover:border-gold/30 rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-cream text-sm">Share on WhatsApp</span>
            </button>

            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-3 bg-black-900 hover:bg-gold/10 border border-black-900 hover:border-gold/30 rounded-lg transition-all duration-300"
              >
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <span className="text-cream text-sm">Visit Official Website</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full py-2 text-cream/60 hover:text-cream text-sm transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Instagram-style Brand Card Component
function InstagramBrandCard({ brand, index }: { brand: Brand; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    // Open WhatsApp with pre-filled message about the brand
    const message = `Hi, I'd like to learn more about ${brand.name} cigars at Club Mareva Beirut.`;
    window.open(`https://wa.me/+96179117997?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <motion.article
        ref={ref}
        id={brand.name.toLowerCase().replace(/\s+/g, '-')}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="bg-black-800 border border-black-900 rounded-lg overflow-hidden max-w-lg mx-auto"
      >
        {/* Header: Logo + Brand Name + Follow */}
        <div className="flex items-center justify-between p-4 border-b border-black-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/30 bg-black-900 flex items-center justify-center">
              <Image
                src="/images/club-mareva-logo-gold.svg"
                alt="Club Mareva Beirut"
                width={40}
                height={40}
                className="object-contain p-1"
              />
            </div>
            <div>
              <h3 className="text-cream font-semibold text-sm">Club Mareva Beirut</h3>
              <p className="text-cream/60 text-xs">
                {brand.name} • {brand.origin}
              </p>
            </div>
          </div>
          <a
            href="https://instagram.com/clubmarevabeirut"
            target="_blank"
            rel="noopener noreferrer"
            className="font-playfair font-medium tracking-wide uppercase transition-all duration-300 relative inline-flex items-center justify-center bg-transparent border-2 border-gold text-gold hover:bg-gold/10 px-4 py-2 text-sm text-xs py-1.5 px-3"
          >
            Follow
          </a>
        </div>

        {/* Hero Image - 4:5 Instagram ratio */}
        <motion.div
          className="aspect-[4/5] relative bg-black-900 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black-800 via-black to-black-900">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                fill
                className="object-contain p-16 opacity-80"
              />
            </div>
            {/* Subtle gold vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(201,162,39,0.05)_100%)]" />
          </div>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>

        {/* Engagement Icons */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 1.3 }}
              className="focus:outline-none"
            >
              <HeartIcon
                filled={isLiked}
                className={`transition-colors duration-200 ${isLiked ? 'text-red-500' : 'text-cream hover:text-cream/70'}`}
              />
            </motion.button>
            <motion.button
              onClick={handleComment}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-cream hover:text-cream/70 transition-colors focus:outline-none"
            >
              <CommentIcon />
            </motion.button>
            <motion.button
              onClick={() => setShowShareModal(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-cream hover:text-cream/70 transition-colors focus:outline-none"
            >
              <ShareIcon />
            </motion.button>
          </div>
          <motion.button
            onClick={() => setIsSaved(!isSaved)}
            whileTap={{ scale: 1.2 }}
            className="focus:outline-none"
          >
            <BookmarkIcon
              filled={isSaved}
              className={`transition-colors duration-200 ${isSaved ? 'text-gold' : 'text-cream hover:text-cream/70'}`}
            />
          </motion.button>
        </div>

        {/* Likes count */}
        {likeCount > 0 && (
          <div className="px-4 pb-2">
            <p className="text-cream text-sm font-semibold">
              {likeCount} likes
            </p>
          </div>
        )}

        {/* Caption */}
        <div className="px-4 pb-3">
          <p className="text-cream text-sm leading-relaxed">
            <span className="font-semibold">{brand.name}</span>{' '}
            {isExpanded || brand.description.length <= 150
              ? brand.description
              : `${brand.description.slice(0, 150).trimEnd()}...`}
            {brand.description.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-cream/50 hover:text-cream/70 ml-1 transition-colors"
              >
                {isExpanded ? 'less' : 'more'}
              </button>
            )}
          </p>
          {brand.hashtags && (
            <p className="text-gold/70 text-sm mt-2">
              {brand.hashtags.join(' ')}
            </p>
          )}
        </div>

        {/* Testimonial */}
        {brand.testimonial && (
          <div className="px-4 py-3 border-t border-black-900 bg-black-900/50">
            <div className="flex items-start gap-2">
              <span className="text-gold text-lg">❝</span>
              <div>
                <p className="text-cream/80 text-sm italic leading-relaxed">
                  {brand.testimonial.quote}
                </p>
                <p className="text-gold text-xs mt-2">
                  — {brand.testimonial.author}, {brand.testimonial.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-black-900">
          <p className="text-cream/50 text-xs">
            View all reviews • Featured at Club Mareva
          </p>
        </div>
      </motion.article>

      {/* Share Modal */}
      <ShareModal
        brand={brand}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}

function PhilosophyPillar({ pillar, index }: { pillar: typeof philosophyPillars[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="text-center px-6"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-gold/30 text-gold">
        {pillar.icon}
      </div>
      <h3 className="font-playfair text-xl text-gold mb-4 tracking-wide font-semibold">
        {pillar.title}
      </h3>
      <p className="font-playfair text-cream/80 text-sm leading-relaxed">
        {pillar.description}
      </p>
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
    >
      <span className="font-playfair text-cream/60 text-xs uppercase tracking-[0.2em]">
        Discover Our Collection
      </span>
      <div className="animate-scroll-bounce">
        <svg
          className="w-6 h-6 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function CigarsPage() {
  const philosophyRef = useRef(null);
  const isPhilosophyInView = useInView(philosophyRef, { once: true, margin: "-50px" });

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Hero Banner */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Video/Image Background */}
        <VideoBackground
          posterSrc="/images/clubmarevabeirut/2025/Delamain-Sig-Cigar-Bottles-at-Club-Mareva-Beirut-scaled.jpg"
          fallbackImageSrc="/images/clubmarevabeirut/2025/Delamain-Sig-Cigar-Bottles-at-Club-Mareva-Beirut-scaled.jpg"
          alt="Club Mareva Beirut Cigars"
          overlayClassName="bg-black/70"
          enableKenBurns={true}
        />

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] z-10" />

        {/* Hero content */}
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl text-gold mb-6 tracking-tight font-bold">
              THE CIGARS
            </h1>
            <motion.div
              className="w-24 h-[2px] bg-gold mx-auto mb-6"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.p
              className="font-playfair text-cream text-lg md:text-xl max-w-2xl mx-auto tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.7 }}
            >
              Over 220 premium varieties from the world's finest regions
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </section>

      {/* Philosophy Section - "The Art of Selection" */}
      <section className="py-24 px-4 bg-black relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black-800/20 to-black" />

        <motion.div
          ref={philosophyRef}
          className="max-w-6xl mx-auto relative z-10"
          initial={{ opacity: 0 }}
          animate={isPhilosophyInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isPhilosophyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-playfair text-gold/70 text-sm uppercase tracking-[0.3em] mb-4">
                Our Philosophy
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-gold mb-6 tracking-tight font-bold">
                THE ART OF SELECTION
              </h2>
              <div className="w-16 h-[2px] bg-gold mx-auto" />
            </motion.div>
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {philosophyPillars.map((pillar, index) => (
              <PhilosophyPillar key={pillar.title} pillar={pillar} index={index} />
            ))}
          </div>

          {/* Bottom decorative divider */}
          <motion.div
            className="flex items-center gap-4 mt-20"
            initial={{ opacity: 0 }}
            animate={isPhilosophyInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Instagram-Style Brand Feed */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          {/* Section title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-playfair text-gold/70 text-sm uppercase tracking-[0.3em] mb-4">
              Curated Excellence
            </p>
            <h2 className="font-playfair text-5xl md:text-6xl text-gold mb-4 tracking-tight font-bold">
              OUR BRANDS
            </h2>
            <div className="w-16 h-[2px] bg-gold mx-auto mb-6" />
            <p className="font-playfair text-cream/70 text-sm max-w-xl mx-auto">
              Explore our carefully curated selection of the world's finest cigar brands,
              each chosen for their exceptional quality and heritage.
            </p>
          </motion.div>

          {/* Instagram-style feed - 2 column layout on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brands.map((brand, index) => (
              <InstagramBrandCard key={brand.name} brand={brand} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-20 bg-black" />
    </div>
  );
}
