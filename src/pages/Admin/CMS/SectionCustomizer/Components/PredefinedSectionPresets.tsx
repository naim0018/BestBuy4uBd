import React from "react";
import { Sparkles, Check, Zap, Grid, ShoppingBag, Tag, Crown, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";

export interface SectionPreset {
  id: number;
  name: string;
  badgeText: string;
  description: string;
  sectionsCount: number;
  previewBlocks: { title: string; color: string; icon: any }[];
}

export const PREDEFINED_SECTION_PRESETS: SectionPreset[] = [
  {
    id: 0,
    name: "Style 0 - Mega Store Layout",
    badgeText: "Default Active",
    description: "Complete e-commerce homepage with Hero, Flash Deals, Categories, Product Row & Guarantees.",
    sectionsCount: 6,
    previewBlocks: [
      { title: "Hero Slider", color: "bg-blue-500", icon: Sparkles },
      { title: "Flash Deals", color: "bg-red-500", icon: Zap },
      { title: "Categories", color: "bg-emerald-500", icon: Grid },
      { title: "Featured Products", color: "bg-purple-500", icon: ShoppingBag },
      { title: "Promo Banners", color: "bg-amber-500", icon: Tag },
      { title: "Trust Bar", color: "bg-slate-800", icon: ShieldCheck },
    ],
  },
  {
    id: 1,
    name: "Style 1 - High Conversion Flash Sales",
    badgeText: "High Conversion",
    description: "Puts flash sales & limited-time deals right at top of page for maximum conversion rate.",
    sectionsCount: 4,
    previewBlocks: [
      { title: "Flash Deals Countdown", color: "bg-red-500", icon: Zap },
      { title: "Hero Slider", color: "bg-blue-500", icon: Sparkles },
      { title: "Tabbed Showcase", color: "bg-indigo-500", icon: ShoppingBag },
      { title: "Trust Bar", color: "bg-slate-800", icon: ShieldCheck },
    ],
  },
  {
    id: 2,
    name: "Style 2 - Tech & Electronics Hub",
    badgeText: "Gadgets & Tech",
    description: "Designed for gadget and electronics stores featuring category icons & brand spotlight.",
    sectionsCount: 5,
    previewBlocks: [
      { title: "Hero Tech Slider", color: "bg-blue-600", icon: Sparkles },
      { title: "Category Bubbles", color: "bg-emerald-500", icon: Grid },
      { title: "Product Grid", color: "bg-purple-500", icon: ShoppingBag },
      { title: "Brand Spotlight", color: "bg-pink-500", icon: Crown },
      { title: "Newsletter Capture", color: "bg-rose-500", icon: Mail },
    ],
  },
  {
    id: 3,
    name: "Style 3 - Minimalist Fashion Boutique",
    badgeText: "Apparel & Lifestyle",
    description: "Clean aesthetic with prominent promotional banners and curated product collections.",
    sectionsCount: 4,
    previewBlocks: [
      { title: "Minimal Hero Banner", color: "bg-slate-900", icon: Sparkles },
      { title: "Promo Banner Grid", color: "bg-amber-500", icon: Tag },
      { title: "Featured Collection", color: "bg-purple-500", icon: ShoppingBag },
      { title: "Brand Spotlight", color: "bg-pink-500", icon: Crown },
    ],
  },
  {
    id: 4,
    name: "Style 4 - Compact Catalog & Deals",
    badgeText: "Simple Clean",
    description: "Quick navigation for mobile-first shoppers with category grid on top.",
    sectionsCount: 4,
    previewBlocks: [
      { title: "Category Grid", color: "bg-emerald-500", icon: Grid },
      { title: "Flash Deals", color: "bg-red-500", icon: Zap },
      { title: "Product Grid", color: "bg-purple-500", icon: ShoppingBag },
      { title: "Newsletter Capture", color: "bg-rose-500", icon: Mail },
    ],
  },
  {
    id: 5,
    name: "Style 5 - Custom Studio Layout",
    badgeText: "Custom Built",
    description: "Your custom section layout designed in the Custom Section Studio tab.",
    sectionsCount: 6,
    previewBlocks: [
      { title: "Custom Stack 1", color: "bg-purple-600", icon: Sparkles },
      { title: "Custom Stack 2", color: "bg-blue-600", icon: Zap },
      { title: "Custom Stack 3", color: "bg-indigo-600", icon: Grid },
    ],
  },
];

interface PredefinedSectionPresetsProps {
  selectedPresetId: number;
  setSelectedPresetId: (id: number) => void;
}

export const PredefinedSectionPresets: React.FC<PredefinedSectionPresetsProps> = ({
  selectedPresetId,
  setSelectedPresetId,
}) => {
  const handleSelect = (preset: SectionPreset) => {
    setSelectedPresetId(preset.id);
    localStorage.setItem("selected_home_section_preset", preset.id.toString());
    toast.success(`Selected "${preset.name}" as storefront layout!`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {PREDEFINED_SECTION_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-full ${
                isSelected
                  ? "border-blue-600 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-md scale-[1.01]"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30"
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge & Title */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {preset.name}
                  </span>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold shrink-0">
                      {preset.badgeText}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {preset.description}
                </p>

                {/* Visual Wireframe Preview Stack */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-inner">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Section Ordering Wireframe ({preset.sectionsCount} Blocks)
                  </span>
                  {preset.previewBlocks.map((blk, idx) => {
                    const IconComp = blk.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <span className={`w-2 h-2 rounded-full ${blk.color}`} />
                        <IconComp className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{blk.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Select Button */}
              <div className="pt-4">
                <Button
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  className="w-full justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(preset);
                  }}
                >
                  {isSelected ? "Current Active Layout" : "Select This Layout"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
