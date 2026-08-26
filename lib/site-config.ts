// ⚠️ PLACEHOLDER BUSINESS INFO — replace every value in this file with
// Expert Fence's real details before sending customers to the live site.
// Phone number below uses the North American "555-01xx" block, which is
// permanently reserved for fictitious use and is not a real, dialable number.

export const siteConfig = {
  businessName: "Expert Fence",
  tagline: "DMV's Trusted Fence Installation & Repair Experts",
  phoneDisplay: "(301) 555-0142",
  phoneHref: "+13015550142",
  email: "info@expertfence-placeholder.com",
  address: {
    line1: "[Street Address — add real address]",
    city: "Upper Marlboro",
    state: "MD",
    zip: "20772",
  },
  hours: [
    { day: "Monday – Friday", time: "7:00 AM – 6:00 PM" },
    { day: "Saturday", time: "8:00 AM – 4:00 PM" },
    { day: "Sunday", time: "Closed (emergency repairs by request)" },
  ],
  license: "MHIC / Class A Contractor License #[Add License Number]",
  yearsInBusiness: 15,
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    google: "https://g.page/",
  },
  domainNote: "Deployed on a Vercel subdomain — connect a custom domain (e.g. expertfencedmv.com) when ready.",
};

export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  heroDescription: string;
  bullets: string[];
  idealFor: string[];
};

export const services: Service[] = [
  {
    slug: "wood-fence-installation",
    name: "Wood Fence Installation",
    shortDescription: "Classic privacy, picket, and split-rail wood fencing built to last through DMV winters.",
    heroDescription:
      "Wood remains the most requested fence style across the DMV for good reason — it's warm, customizable, and boosts curb appeal. We install cedar, pressure-treated pine, and premium hardwood fencing in privacy, picket, board-on-board, and split-rail styles, all set in concrete footings rated for our region's freeze-thaw cycles.",
    bullets: [
      "Cedar, pressure-treated pine, and hardwood options",
      "Privacy, semi-privacy, picket, shadowbox, and split-rail styles",
      "Concrete-set posts engineered for Mid-Atlantic soil and frost lines",
      "Stain and sealant add-on packages available",
    ],
    idealFor: ["Backyard privacy", "Pool enclosures", "Pet containment", "Curb appeal upgrades"],
  },
  {
    slug: "vinyl-pvc-fence-installation",
    name: "Vinyl & PVC Fence Installation",
    shortDescription: "Low-maintenance vinyl privacy and picket fencing that won't rot, warp, or need repainting.",
    heroDescription:
      "Vinyl fencing gives homeowners the look of a classic wood fence with a fraction of the upkeep. Our vinyl systems are UV-stabilized for the DMV's hot, humid summers and won't crack in winter cold. Available in privacy, semi-privacy, and picket profiles with a lifetime manufacturer warranty on most product lines.",
    bullets: [
      "UV-stabilized, won't fade, rot, or splinter",
      "Privacy, semi-privacy, and picket profiles",
      "Manufacturer warranties on materials",
      "Wide color and texture selection, including wood-grain finishes",
    ],
    idealFor: ["Low-maintenance privacy", "HOA-compliant installs", "Long-term durability"],
  },
  {
    slug: "chain-link-fence-installation",
    name: "Chain Link Fence Installation",
    shortDescription: "Affordable, durable galvanized and vinyl-coated chain link for residential and commercial sites.",
    heroDescription:
      "Chain link is the most cost-effective way to secure a property line, dog run, or commercial lot. We install galvanized and black vinyl-coated chain link in a range of heights and gauges, with optional privacy slats for added screening.",
    bullets: [
      "Galvanized and vinyl-coated (black/green) options",
      "Residential, commercial, and industrial gauges",
      "Optional privacy slats and windscreen",
      "Fast turnaround for large perimeter jobs",
    ],
    idealFor: ["Budget-friendly security", "Commercial lots", "Dog runs & play areas", "Temporary-to-permanent upgrades"],
  },
  {
    slug: "aluminum-ornamental-iron-fence",
    name: "Aluminum & Ornamental Iron Fencing",
    shortDescription: "Elegant, powder-coated aluminum and wrought-iron-style fencing for pools, estates, and entryways.",
    heroDescription:
      "For homeowners who want the upscale look of wrought iron without the rust and maintenance, our powder-coated aluminum fencing delivers a premium finish that holds up outdoors. Pool-code-compliant options are available for Maryland and Virginia self-latching gate requirements.",
    bullets: [
      "Powder-coated, rust-resistant aluminum",
      "Pool-code-compliant self-closing/self-latching gates",
      "Decorative finials, scrollwork, and estate-style options",
      "Custom gate automation available",
    ],
    idealFor: ["Pool enclosures", "Front-yard elegance", "HOA & estate properties"],
  },
  {
    slug: "commercial-fencing",
    name: "Commercial Fencing",
    shortDescription: "Security, perimeter, and access-control fencing for businesses, schools, and job sites across the DMV.",
    heroDescription:
      "From loading-dock security to full perimeter build-outs, our commercial division handles bid specs, permitting, and phased installation for property managers, general contractors, schools, and municipalities across DC, Maryland, and Virginia.",
    bullets: [
      "Chain link, ornamental, and high-security fencing",
      "Gate operators and access-control integration",
      "Bonded & insured for commercial contracts",
      "Experience with bid specs and multi-phase job sites",
    ],
    idealFor: ["Property managers", "General contractors", "Schools & municipalities", "Warehouses & job sites"],
  },
  {
    slug: "residential-fencing",
    name: "Residential Fencing",
    shortDescription: "Full-service backyard, front-yard, and pool fencing designed around how your family uses the yard.",
    heroDescription:
      "Every residential quote starts with a free on-site consultation to walk your property line, flag utilities, and talk through material, height, and gate placement — so the fence you get matches how your family actually uses the yard.",
    bullets: [
      "Free on-site consultation & property walk",
      "HOA documentation packages prepared for you",
      "Utility locate coordination included",
      "Financing options available",
    ],
    idealFor: ["New homeowners", "Growing families", "Pet owners", "HOA communities"],
  },
  {
    slug: "fence-repair-gate-installation",
    name: "Fence Repair & Gate Installation",
    shortDescription: "Storm damage repair, leaning post fixes, and new gate installation for existing fences.",
    heroDescription:
      "Not every job is a full replacement. Our repair crews handle storm-damaged panels, leaning or rotted posts, sagging gates, and broken hardware — plus new gate installation and automation for fences we didn't originally build.",
    bullets: [
      "Storm & wind damage repair",
      "Post replacement and re-setting",
      "New gate installation on existing fence lines",
      "Gate automation & access control retrofits",
    ],
    idealFor: ["Storm damage", "Aging fences", "Gate upgrades", "Pre-sale repairs"],
  },
];

export type ServiceArea = {
  slug: string;
  name: string;
  region: "DC" | "Maryland" | "Virginia";
  blurb: string;
};

export const serviceAreas: ServiceArea[] = [
  { slug: "washington-dc", name: "Washington, D.C.", region: "DC", blurb: "Row-home yards, rooftop pool enclosures, and HOA/condo association fencing across all eight wards." },
  { slug: "montgomery-county-md", name: "Montgomery County, MD", region: "Maryland", blurb: "Bethesda, Rockville, Silver Spring, and Gaithersburg homeowners choose us for HOA-compliant wood and vinyl installs." },
  { slug: "princes-georges-county-md", name: "Prince George's County, MD", region: "Maryland", blurb: "Serving Bowie, Upper Marlboro, Hyattsville, and Laurel with residential and commercial fencing." },
  { slug: "anne-arundel-county-md", name: "Anne Arundel County, MD", region: "Maryland", blurb: "Annapolis, Glen Burnie, and Odenton properties, including waterfront and pool-code installs." },
  { slug: "howard-county-md", name: "Howard County, MD", region: "Maryland", blurb: "Columbia and Ellicott City homeowners and HOAs trust us for premium vinyl and ornamental aluminum." },
  { slug: "arlington-county-va", name: "Arlington County, VA", region: "Virginia", blurb: "Compact lots and dense neighborhoods call for precise layout — our Arlington crews specialize in tight-site installs." },
  { slug: "fairfax-county-va", name: "Fairfax County, VA", region: "Virginia", blurb: "Fairfax, Reston, Vienna, and McLean — from HOA picket fencing to estate-scale ornamental iron." },
  { slug: "alexandria-va", name: "City of Alexandria, VA", region: "Virginia", blurb: "Historic-district-aware installs plus modern privacy fencing for Alexandria's mix of old and new construction." },
  { slug: "loudoun-county-va", name: "Loudoun County, VA", region: "Virginia", blurb: "Ashburn and Leesburg's newest communities rely on us for full-perimeter residential fencing." },
  { slug: "prince-william-county-va", name: "Prince William County, VA", region: "Virginia", blurb: "Woodbridge and Manassas homeowners and property managers get fast, reliable commercial and residential service." },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Do I need a permit to install a fence in the DMV?",
    answer:
      "It depends on your jurisdiction, fence height, and whether you're in an HOA. Many DC, Maryland, and Virginia counties require a permit for fences over a certain height or near property lines. We handle permit research and paperwork as part of every residential quote.",
  },
  {
    question: "How long does a typical fence installation take?",
    answer:
      "Most residential projects (150–300 linear feet) are completed in 1–3 days once materials arrive. Commercial and large-perimeter jobs are scoped individually and staged around your site's schedule.",
  },
  {
    question: "Do you handle HOA approval paperwork?",
    answer:
      "Yes — we prepare the drawings, material specs, and property surveys most HOAs require, and many of our crews have direct experience with the HOA-approved vendor lists across Montgomery, Fairfax, and Howard counties.",
  },
  {
    question: "What's the difference between wood and vinyl fencing?",
    answer:
      "Wood costs less upfront and offers a classic look but needs periodic staining/sealing. Vinyl costs more initially but requires no painting or sealing and typically comes with a longer manufacturer warranty. We'll walk through both during your free consultation.",
  },
  {
    question: "Do you offer financing?",
    answer: "Yes, financing options are available for qualified residential and commercial projects — ask your estimator for current terms.",
  },
  {
    question: "Is the estimate free?",
    answer: "Yes. Every quote starts with a free, no-obligation on-site consultation and written estimate.",
  },
];
