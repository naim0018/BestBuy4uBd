import { Link } from "react-router-dom";

interface BannerCard {
  label: string;
  heading: string;
  ctaText: string;
  ctaLink: string;
  bg: string;
  labelColor: string;
  headingColor: string;
  btnBg: string;
  image: string;
  size: "small" | "large";
}

const CARDS: BannerCard[] = [
  {
    label: "Fresh",
    heading: "Meat",
    ctaText: "Shop Now",
    ctaLink: "/products?category=Meat",
    bg: "#fde68a",
    labelColor: "#fff",
    headingColor: "#ef4444",
    btnBg: "#ef4444",
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80",
    size: "small",
  },
  {
    label: "STOCK UP ON",
    heading: "ESSENTIALS",
    ctaText: "Shop Now",
    ctaLink: "/products?category=Essentials",
    bg: "#16a34a",
    labelColor: "#fff",
    headingColor: "#fff",
    btnBg: "#ef4444",
    image:
      "https://images.unsplash.com/photo-1583258492852-0bc259ab1fe3?w=700&q=80",
    size: "large",
  },
  {
    label: "Fresh",
    heading: "Fish",
    ctaText: "Shop Now",
    ctaLink: "/products?category=Fish",
    bg: "#bbf7d0",
    labelColor: "#166534",
    headingColor: "#fef08a",
    btnBg: "#16a34a",
    image:
      "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&q=80",
    size: "small",
  },
];

const SmallCard = ({ card }: { card: BannerCard }) => (
  <Link
    to={card.ctaLink}
    className="relative flex items-end overflow-hidden rounded-xl group"
    style={{ backgroundColor: card.bg, minHeight: "148px" }}
  >
    {/* Text overlay */}
    <div className="relative z-10 p-5 flex-1">
      <p
        className="text-base font-black italic leading-none"
        style={{ color: card.labelColor }}
      >
        {card.label}
      </p>
      <p
        className="text-2xl font-black italic leading-tight mb-3"
        style={{ color: card.headingColor }}
      >
        {card.heading}
      </p>
      <span
        className="inline-block text-white text-xs font-bold px-4 py-1.5 rounded"
        style={{ backgroundColor: card.btnBg }}
      >
        {card.ctaText}
      </span>
    </div>
    {/* Product image */}
    <img
      src={card.image}
      alt={card.heading}
      className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-left group-hover:scale-105 transition-transform duration-500"
    />
  </Link>
);

const LargeCard = ({ card }: { card: BannerCard }) => (
  <Link
    to={card.ctaLink}
    className="relative flex items-center overflow-hidden rounded-xl group h-full min-h-[316px]"
    style={{ backgroundColor: card.bg }}
  >
    {/* Text */}
    <div className="relative z-10 p-8 w-1/2">
      <p
        className="text-lg font-bold uppercase tracking-wider mb-1"
        style={{ color: card.labelColor }}
      >
        {card.label}
      </p>
      <p
        className="text-4xl font-black uppercase leading-tight mb-6"
        style={{ color: card.headingColor }}
      >
        {card.heading}
      </p>
      <span
        className="inline-block text-white text-sm font-bold px-6 py-2.5 rounded"
        style={{ backgroundColor: card.btnBg }}
      >
        {card.ctaText}
      </span>
    </div>
    {/* Image */}
    <img
      src={card.image}
      alt={card.heading}
      className="absolute right-0 top-0 h-full w-3/5 object-cover object-left opacity-70 group-hover:scale-105 transition-transform duration-500"
    />
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(to right, ${card.bg} 35%, transparent 70%)`,
      }}
    />
  </Link>
);

const FeaturedSection = () => {
  return (
    <section className="py-10 bg-bg-base">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 rounded-full bg-secondary inline-block" />
          <h2 className="text-xl font-bold text-text-primary">Featured</h2>
        </div>

        {/* Grid — mirrors the reference image */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left column: two small cards stacked */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <SmallCard card={CARDS[0]} />
            <SmallCard card={CARDS[2]} />
          </div>

          {/* Right column: one large card */}
          <div className="md:col-span-8 h-full">
            <LargeCard card={CARDS[1]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
