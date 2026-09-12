import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Sliders,
  Sparkles,
  Zap,
  Grid,
  ShoppingBag,
  Tag,
  Award,
  Crown,
  ShieldCheck,
  Mail,
  Check,
} from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";
import {
  SectionBlockConfig,
  RenderSectionPlaceholder,
} from "./PlaceholderComponents";

// Available Component Templates Library to Add
export const AVAILABLE_PLACEHOLDERS = [
  {
    type: "hero_slider" as const,
    title: "Hero Banner Carousel",
    subtitle: "High-impact promotional slider with call-to-action buttons",
    icon: Sparkles,
    badge: "Hero Banner",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    type: "flash_deals" as const,
    title: "Flash Deals Countdown Row",
    subtitle: "Urgency-driven deal grid with real-time countdown timer",
    icon: Zap,
    badge: "High Conversion",
    color: "text-red-500 bg-red-500/10",
  },
  {
    type: "category_grid" as const,
    title: "Category Bubble Grid",
    subtitle: "Clean category avatars for quick customer navigation",
    icon: Grid,
    badge: "Navigation",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    type: "product_grid" as const,
    title: "Featured Product Grid",
    subtitle: "Customizable product card columns (4, 8, 12 items)",
    icon: ShoppingBag,
    badge: "Product Row",
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    type: "banner_row" as const,
    title: "Promotional Banner Grid",
    subtitle: "Dual promo image callouts for special sales or categories",
    icon: Tag,
    badge: "Promotions",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    type: "tabbed_showcase" as const,
    title: "Tabbed Category Showcase",
    subtitle: "Filter products by All, New Arrivals, and Best Sellers",
    icon: Award,
    badge: "Interactive",
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    type: "brand_spotlight" as const,
    title: "Brand Spotlight Row",
    subtitle: "Highlight official brand partners and logos",
    icon: Crown,
    badge: "Branding",
    color: "text-pink-500 bg-pink-500/10",
  },
  {
    type: "features_bar" as const,
    title: "Trust & Features Guarantee Bar",
    subtitle: "Display fast shipping, warranty, and return guarantees",
    icon: ShieldCheck,
    badge: "Trust Badges",
    color: "text-teal-500 bg-teal-500/10",
  },
  {
    type: "newsletter_bar" as const,
    title: "Newsletter Subscription Callout",
    subtitle: "Email capture banner for customer deal notifications",
    icon: Mail,
    badge: "Lead Capture",
    color: "text-rose-500 bg-rose-500/10",
  },
];

const DEFAULT_STACK: SectionBlockConfig[] = [
  {
    id: "sec-1",
    type: "hero_slider",
    title: "Upgrade Your Smart Tech Lifestyle",
    subtitle: "Exclusive Limited Offers",
    isActive: true,
  },
  {
    id: "sec-2",
    type: "flash_deals",
    title: "🔥 Flash Hot Deals",
    subtitle: "Limited time offers with maximum discount",
    isActive: true,
    itemLimit: 4,
  },
  {
    id: "sec-3",
    type: "category_grid",
    title: "Explore Featured Categories",
    subtitle: "Browse products by department",
    isActive: true,
  },
  {
    id: "sec-4",
    type: "product_grid",
    title: "⭐ Featured Products Showcase",
    subtitle: "Handpicked premium products for you",
    isActive: true,
    itemLimit: 4,
  },
  {
    id: "sec-5",
    type: "banner_row",
    title: "Promotional Sales Banners",
    isActive: true,
  },
  {
    id: "sec-6",
    type: "features_bar",
    title: "Storefront Guarantees",
    isActive: true,
  },
];

export const HomeSectionBuilder: React.FC = () => {
  const [sectionsStack, setSectionsStack] = useState<SectionBlockConfig[]>(DEFAULT_STACK);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editingSecId, setEditingSecId] = useState<string | null>(null);

  // Load saved stack from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("home_page_sections_custom_stack");
      if (saved) {
        setSectionsStack(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed loading home stack", e);
    }
  }, []);

  // Add Component to Stack
  const handleAddComponent = (template: (typeof AVAILABLE_PLACEHOLDERS)[0]) => {
    const newSec: SectionBlockConfig = {
      id: `sec-${Date.now()}`,
      type: template.type,
      title: template.title,
      subtitle: template.subtitle,
      isActive: true,
      itemLimit: 4,
    };
    const updated = [...sectionsStack, newSec];
    setSectionsStack(updated);
    toast.success(`Added "${template.title}" to Home Page sections!`);
  };

  // Move Section Up/Down
  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionsStack.length) return;
    const updated = [...sectionsStack];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSectionsStack(updated);
  };

  // Toggle Visibility
  const handleToggleActive = (id: string) => {
    setSectionsStack((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  // Delete Section
  const handleDelete = (id: string, title: string) => {
    setSectionsStack((prev) => prev.filter((item) => item.id !== id));
    if (editingSecId === id) setEditingSecId(null);
    toast.info(`Removed "${title}" from sections stack.`);
  };

  // Update Section Properties
  const handleUpdateProp = (id: string, key: keyof SectionBlockConfig, value: any) => {
    setSectionsStack((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  // Save to LocalStorage
  const handleSaveStack = () => {
    try {
      localStorage.setItem("home_page_sections_custom_stack", JSON.stringify(sectionsStack));
      toast.success("Home Section Layout saved successfully!");
    } catch (e) {
      toast.error("Failed to save layout.");
    }
  };

  // Reset Stack
  const handleResetStack = () => {
    setSectionsStack(DEFAULT_STACK);
    localStorage.removeItem("home_page_sections_custom_stack");
    toast.info("Reset to default home page section stack.");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-500" />
            Home Layout Section Builder Studio
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag, reorder, configure, or insert placeholder components to customize the storefront home layout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetStack}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveStack}>
            <Save className="w-3.5 h-3.5 mr-1" /> Save Home Layout
          </Button>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left) + Live Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Library + Active Stack */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Home Stack List */}
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-500" />
                Active Page Layout Stack ({sectionsStack.length})
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {sectionsStack.filter((s) => s.isActive).length} Visible
              </span>
            </div>

            {sectionsStack.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <Sparkles className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  No sections in layout stack
                </p>
                <p className="text-[10px] text-slate-400">
                  Add components from the library below to construct your home layout.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {sectionsStack.map((sec, index) => {
                  const templateInfo = AVAILABLE_PLACEHOLDERS.find((p) => p.type === sec.type);
                  const IconComp = templateInfo?.icon || Sliders;
                  const isEditing = editingSecId === sec.id;

                  return (
                    <div
                      key={sec.id}
                      className={`p-3 rounded-xl border transition-all space-y-2.5 ${
                        sec.isActive
                          ? "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40"
                          : "border-slate-200/50 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-900/40 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`p-1.5 rounded-lg ${templateInfo?.color || "bg-slate-200 text-slate-700"} shrink-0`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {sec.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium truncate block">
                              {templateInfo?.badge || sec.type}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                          </button>
                          <button
                            onClick={() => handleMove(index, "down")}
                            disabled={index === sectionsStack.length - 1}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(sec.id)}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            title={sec.isActive ? "Hide Section" : "Show Section"}
                          >
                            {sec.isActive ? (
                              <Eye className="w-3.5 h-3.5 text-blue-500" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingSecId(isEditing ? null : sec.id)}
                            className={`p-1 rounded transition-all ${
                              isEditing
                                ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600"
                                : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                            }`}
                            title="Settings"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(sec.id, sec.title)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section Editor */}
                      {isEditing && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Display Title
                            </label>
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) => handleUpdateProp(sec.id, "title", e.target.value)}
                              className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={sec.subtitle || ""}
                              onChange={(e) => handleUpdateProp(sec.id, "subtitle", e.target.value)}
                              className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          {["flash_deals", "product_grid", "tabbed_showcase"].includes(sec.type) && (
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">
                                Display Items Count
                              </label>
                              <input
                                type="number"
                                min={2}
                                max={8}
                                value={sec.itemLimit || 4}
                                onChange={(e) =>
                                  handleUpdateProp(sec.id, "itemLimit", parseInt(e.target.value) || 4)
                                }
                                className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Placeholder Component Library */}
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-purple-500" />
                Add Placeholder Components Library
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {AVAILABLE_PLACEHOLDERS.map((template) => {
                const IconComp = template.icon;
                return (
                  <div
                    key={template.type}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between gap-3 group transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-xl ${template.color} shrink-0`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {template.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {template.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddComponent(template)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Real-time Live Storefront Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            {/* Canvas Header & Viewport Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Live Home Page Storefront Canvas
                </span>
              </div>

              {/* Viewport Toggles */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                <button
                  onClick={() => setViewportMode("desktop")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === "desktop"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewportMode("tablet")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === "tablet"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewportMode("mobile")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === "mobile"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Storefront Viewport Container */}
            <div className="w-full bg-slate-100 dark:bg-slate-950 p-3 sm:p-6 rounded-xl overflow-x-auto min-h-[500px] flex justify-center">
              <div
                className={`transition-all duration-300 space-y-6 w-full ${
                  viewportMode === "desktop"
                    ? "max-w-full"
                    : viewportMode === "tablet"
                    ? "max-w-[720px]"
                    : "max-w-[380px]"
                }`}
              >
                {sectionsStack.filter((s) => s.isActive).length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <EyeOff className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      All sections are currently hidden
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Toggle eye icons in the stack panel to show sections on storefront.
                    </p>
                  </div>
                ) : (
                  sectionsStack.map((secConfig) => (
                    <div key={secConfig.id} className="transition-all duration-300">
                      <RenderSectionPlaceholder config={secConfig} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
