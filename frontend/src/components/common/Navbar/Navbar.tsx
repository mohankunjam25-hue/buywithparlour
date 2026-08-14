import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../../services/api/axios';
import { ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface SubcategoryGroup {
  title: string;
  items: { label: string; query: string }[];
}

interface CategoryTaxonomy {
  description: string;
  groups: SubcategoryGroup[];
  highlight: { badge: string; text: string; linkQuery: string };
}

const CATEGORY_TAXONOMY_MAP: Record<string, CategoryTaxonomy> = {
  'skin-care': {
    description: 'Dermatologically tested facial care, serums, daily moisturizers & sun defense.',
    groups: [
      {
        title: 'Popular Subcategories',
        items: [
          { label: 'Face Serums & Concentrates', query: 'serum' },
          { label: 'Hydrating Daily Moisturizers', query: 'moisturizer' },
          { label: 'Sunscreens & SPF 50+ Lotions', query: 'sunscreen' },
          { label: 'Gentle Foaming Face Washes', query: 'cleanser' },
          { label: 'Night Repair Creams', query: 'night cream' },
        ],
      },
      {
        title: 'Shop By Concern',
        items: [
          { label: 'Radiance & Dark Spot Correction', query: 'vitamin c' },
          { label: 'Deep Cellular Hydration', query: 'hyaluronic' },
          { label: 'Anti-Aging & Firming Therapy', query: 'anti-aging' },
          { label: 'Acne & Blemish Control', query: 'acne' },
          { label: 'Oil Balance & Pore Minimizing', query: 'niacinamide' },
        ],
      },
      {
        title: 'Parlour Regimens',
        items: [
          { label: '5-Step Daily Glow Routine', query: 'glow' },
          { label: 'Deep Exfoliation & Peeling', query: 'scrub' },
          { label: 'Hydrating Facial Sheet Masks', query: 'sheet mask' },
          { label: 'Under-Eye Dark Circle Care', query: 'eye cream' },
        ],
      },
    ],
    highlight: {
      badge: 'SKIN SPECIAL',
      text: 'Explore Derm-Approved Vitamin C & Hyaluronic Formulations',
      linkQuery: 'serum',
    },
  },
  'hair-care': {
    description: 'Salon spa intensive nourishing hair oils, keratin shampoos & repair masks.',
    groups: [
      {
        title: 'Hair Care Essentials',
        items: [
          { label: 'Spa Nourishing Hair Oils', query: 'oil' },
          { label: 'Keratin & Protein Shampoos', query: 'shampoo' },
          { label: 'Deep Conditioning Hair Masks', query: 'mask' },
          { label: 'Leave-In Smoothing Conditioners', query: 'conditioner' },
          { label: 'Scalp Detox & Anti-Dandruff', query: 'scalp' },
        ],
      },
      {
        title: 'Targeted Hair Concern',
        items: [
          { label: 'Intense Hair Fall Rescue', query: 'hair fall' },
          { label: 'Frizz Control & Smooth Silk', query: 'frizz' },
          { label: 'Damaged & Treated Hair Repair', query: 'repair' },
          { label: 'Color Lock & Shine Boost', query: 'color protect' },
          { label: 'Volume & Root Strengthening', query: 'volume' },
        ],
      },
      {
        title: 'Salon Spa Therapies',
        items: [
          { label: 'Moroccan Argan Spa Treatment', query: 'argan' },
          { label: 'Cold-Pressed Bhringraj Therapy', query: 'bhringraj' },
          { label: 'Keratin Infusion Therapy', query: 'keratin' },
          { label: 'Botanical Hair Spa Tubs', query: 'hair spa' },
        ],
      },
    ],
    highlight: {
      badge: 'PARLOUR FAVORITE',
      text: 'Pure Cold-Pressed Oils & Salon-Grade Keratin Formulations',
      linkQuery: 'argan',
    },
  },
  'hair-styling': {
    description: 'Heavy-duty professional blow dryers, titanium stylers & thermal sprays.',
    groups: [
      {
        title: 'Professional Styling Tools',
        items: [
          { label: 'Ionic Blow Dryers (2200W+)', query: 'dryer' },
          { label: 'Titanium & Ceramic Straighteners', query: 'straightener' },
          { label: 'Curling Wands & Tongs', query: 'curler' },
          { label: 'Hot Air Volumizing Brushes', query: 'hot brush' },
        ],
      },
      {
        title: 'Heat Protection & Hold',
        items: [
          { label: 'Thermal Heat Protectant Sprays', query: 'heat protect' },
          { label: 'Volumizing & Texturizing Mousse', query: 'mousse' },
          { label: 'Strong Hold Setting Sprays', query: 'spray' },
          { label: 'High Gloss Finishing Serums', query: 'gloss' },
        ],
      },
      {
        title: 'Salon Tools & Accessories',
        items: [
          { label: 'Ceramic Radial Round Brushes', query: 'brush' },
          { label: 'Sectioning Grip Clips', query: 'clips' },
          { label: 'Heat Resistant Styling Mats', query: 'mat' },
        ],
      },
    ],
    highlight: {
      badge: 'SALON GRADE',
      text: 'Heavy-Duty 2200W Dryers with 100% Pure Copper Motors',
      linkQuery: 'dryer',
    },
  },
  'salon-supplies': {
    description: 'Bulk facial kits, waxing heaters, cotton rolls & disposable parlour supplies.',
    groups: [
      {
        title: 'Facial & Bleach Supplies',
        items: [
          { label: 'Diamond & Gold Facial Kits', query: 'facial kit' },
          { label: 'Herbal & Crème Bleach Tubs', query: 'bleach' },
          { label: 'Massage Creams & Cleansing Milk', query: 'massage cream' },
          { label: 'Face Pack Powders & Clays', query: 'clay pack' },
        ],
      },
      {
        title: 'Waxing & Threading',
        items: [
          { label: 'Cartridge & Stripless Liposoluble Wax', query: 'wax' },
          { label: 'Professional Wax Heaters', query: 'heater' },
          { label: '100% Organic Threading Cotton Spools', query: 'threading' },
          { label: 'Pre & Post Wax Soothing Lotions', query: 'post wax' },
        ],
      },
      {
        title: 'Hygiene & Disposables',
        items: [
          { label: 'Salon Disposable Bed Sheets & Gowns', query: 'disposable' },
          { label: 'Facial Headbands & Spatulas', query: 'headband' },
          { label: 'Manicure & Pedicure Spa Packs', query: 'pedicure' },
        ],
      },
    ],
    highlight: {
      badge: 'WHOLESALE SAVINGS',
      text: 'Bulk Salon Pack Discounts Available for Verified Parlour Owners',
      linkQuery: 'facial kit',
    },
  },
};

export const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHoverSlug, setActiveHoverSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data || []);
      })
      .catch((err) => {
        console.warn('Could not fetch categories from API:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getTaxonomy = (slug: string): CategoryTaxonomy => {
    if (CATEGORY_TAXONOMY_MAP[slug]) {
      return CATEGORY_TAXONOMY_MAP[slug];
    }
    return {
      description: 'Explore certified professional beauty parlour supplies & formulations.',
      groups: [
        {
          title: 'Explore Categories',
          items: [
            { label: 'All Featured Formulations', query: 'beauty' },
            { label: 'Best Sellers in this Category', query: 'bestseller' },
            { label: 'New Arrivals & Innovations', query: 'new' },
            { label: 'Professional Parlour Packs', query: 'salon' },
          ],
        },
        {
          title: 'Beauty Concerns',
          items: [
            { label: 'Hydration & Daily Nutrition', query: 'care' },
            { label: 'Intensive Repair & Spa Therapy', query: 'therapy' },
            { label: 'Dermatological Tested Pure Formulations', query: 'pure' },
          ],
        },
      ],
      highlight: {
        badge: 'BUYWITHPARLOUR ASSURED',
        text: '100% Quality & Authenticity Guarantee on all supplies',
        linkQuery: 'beauty',
      },
    };
  };

  return (
    <nav className="bg-white border-b border-[#E0E0E0] sticky top-14 z-40 shadow-[0_1px_4px_rgba(0,0,0,0.08)] relative font-sans">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* All Products Link */}
        <Link
          to="/shop"
          className="py-2.5 px-3 text-xs font-semibold text-[#212121] hover:text-[#2874F0] whitespace-nowrap border-b-2 border-transparent hover:border-[#2874F0] transition-colors flex items-center gap-1"
        >
          <span>All Products</span>
        </Link>

        {/* Dynamic Categories with Hover Dropdown */}
        {loading ? (
          <span className="text-xs text-[#878787] py-2.5 px-3">Loading categories...</span>
        ) : (
          categories.map((cat) => {
            const isHovered = activeHoverSlug === cat.slug;
            const taxonomy = getTaxonomy(cat.slug);

            return (
              <div
                key={cat._id}
                onMouseEnter={() => setActiveHoverSlug(cat.slug)}
                onMouseLeave={() => setActiveHoverSlug(null)}
                className="relative group"
              >
                {/* Category Main Nav Button */}
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-1 transition-all ${
                    isHovered
                      ? 'text-[#2874F0] border-[#2874F0] bg-slate-50'
                      : 'text-[#212121] border-transparent hover:text-[#2874F0] hover:border-[#2874F0]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-150 ${
                      isHovered ? 'rotate-180 text-[#2874F0]' : 'text-[#878787]'
                    }`}
                  />
                </Link>

                {/* Dropdown Mega Menu (Strict 4px Radius & Flipkart Style Layout as per Section 20) */}
                {isHovered && (
                  <div
                    className="absolute top-full left-0 w-[720px] max-w-[90vw] bg-white border border-[#E0E0E0] rounded-[4px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] z-50 p-5 space-y-4 animate-fade-in text-left"
                    style={{ animationDuration: '150ms' }}
                  >
                    {/* Header Summary */}
                    <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2.5">
                      <div>
                        <h4 className="text-sm font-bold text-[#212121]">
                          {cat.name} Taxonomy & Regimens
                        </h4>
                        <p className="text-xs text-[#666666] mt-0.5">{taxonomy.description}</p>
                      </div>

                      <Link
                        to={`/shop?category=${cat.slug}`}
                        className="text-xs font-bold text-[#2874F0] hover:underline flex items-center gap-1"
                      >
                        <span>View All {cat.name}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Subcategories 3-Column Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                      {taxonomy.groups.map((group, idx) => (
                        <div key={idx} className="space-y-2">
                          <h5 className="font-bold text-[#212121] uppercase tracking-wider text-[11px] border-b border-[#EEEEEE] pb-1">
                            {group.title}
                          </h5>
                          <ul className="space-y-1.5 text-[#666666]">
                            {group.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <Link
                                  to={`/shop?category=${cat.slug}&search=${encodeURIComponent(item.query)}`}
                                  className="hover:text-[#2874F0] hover:translate-x-0.5 transition-all inline-block py-0.5"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Promo & Quality Highlight Strip */}
                    <div className="bg-[#F1F3F6] border border-[#E0E0E0] p-2.5 rounded-[4px] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#2874F0] text-white font-bold text-[10px] px-2 py-0.5 rounded-[2px] uppercase">
                          {taxonomy.highlight.badge}
                        </span>
                        <span className="font-medium text-[#212121]">
                          {taxonomy.highlight.text}
                        </span>
                      </div>

                      <Link
                        to={`/shop?category=${cat.slug}&search=${encodeURIComponent(taxonomy.highlight.linkQuery)}`}
                        className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold px-3 py-1 rounded-[2px] transition-colors text-xs flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Quality Guarantee Pill on Right */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#666666] font-medium pl-4">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>100% Quality Assured</span>
        </div>
      </div>
    </nav>
  );
};
