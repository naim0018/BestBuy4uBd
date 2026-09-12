import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  GripVertical,
  Sparkles,
  Grid,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Code,
  Terminal,
} from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";
import {
  SectionBlockConfig,
  RenderSectionPlaceholder,
  DEFAULT_CUSTOM_CODE_TEMPLATE,
} from "./Components/PlaceholderComponents";

export interface PremadeSectionDefinition {
  type: SectionBlockConfig["type"];
  name: string;
}

export const PREMADE_SECTIONS_COLLECTION: PremadeSectionDefinition[] = [
  { type: "custom_code", name: "💻 Custom Code Studio (HTML / Tailwind / JSX)" },
  { type: "hero_split_banner", name: "Hero Split Banner" },
  { type: "category_cards_row", name: "Category Cards Row" },
  { type: "new_arrival_showcase", name: "New Arrival Showcase" },
  { type: "home_appliance_grid", name: "Home Appliance Grid" },
  { type: "kitchen_appliance_grid", name: "Kitchen Appliance Grid" },
  { type: "gifts_grid", name: "Gifts & Accessories Grid" },
  { type: "electronics_grid", name: "Electronics & Gadgets Grid" },
  { type: "storefront_trust_bar", name: "Storefront Trust Bar" },
];

const DEFAULT_BESTBUY_LAYER_SEQUENCE: SectionBlockConfig[] = [
  { id: "layer-hero", type: "hero_split_banner", title: "Hero Split Banner", isActive: true },
  { id: "layer-categories", type: "category_cards_row", title: "Category Cards Row", isActive: true },
  { id: "layer-new-arrival", type: "new_arrival_showcase", title: "New Arrival", isActive: true },
  { id: "layer-home-appliance", type: "home_appliance_grid", title: "Home Appliance", isActive: true },
  { id: "layer-kitchen-appliance", type: "kitchen_appliance_grid", title: "Kitchen Appliance", isActive: true },
  { id: "layer-gifts", type: "gifts_grid", title: "Gifts", isActive: true },
  { id: "layer-electronics", type: "electronics_grid", title: "Electronics", isActive: true },
  { id: "layer-trust-bar", type: "storefront_trust_bar", title: "Storefront Trust Bar", isActive: true },
];

const STARTER_CODE_TEMPLATES = [
  {
    name: "⚡ Custom Hero Gradient Callout",
    code: `<div class="w-full p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-900 to-blue-950 text-white shadow-2xl border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
  <div class="space-y-3 max-w-xl">
    <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
      ⚡ SPECIAL EXCLUSIVE PROMO
    </div>
    <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
      Custom Tailored Storefront Component
    </h2>
    <p class="text-xs sm:text-sm text-slate-300">
      Edit this HTML & Tailwind code directly from the live Code Editor studio! Add custom grids, banners, call-to-actions, or embedded widgets.
    </p>
  </div>
  <div class="flex items-center gap-3 shrink-0">
    <button class="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all transform hover:scale-105 cursor-pointer">
      Shop Exclusive Deals →
    </button>
  </div>
</div>`,
  },
  {
    name: "📢 Animated Marquee Announcement Ticker",
    code: `<div class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg overflow-hidden flex items-center justify-between gap-4">
  <div class="flex items-center gap-2 shrink-0">
    <span class="px-2.5 py-0.5 rounded-full bg-white text-red-600 text-[10px] font-black uppercase">LIVE ALERT</span>
    <span class="text-xs font-bold">🔥 FLASH CLEARANCE SALE:</span>
  </div>
  <div class="text-xs font-bold tracking-wide truncate">
    Get up to 60% OFF on all Kitchen Appliances & Home Electronics with code <span class="bg-black/30 px-2 py-0.5 rounded text-amber-300 font-mono">BESTBUY2026</span>
  </div>
  <button class="px-4 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase shrink-0 transition-all cursor-pointer">
    Claim Offer
  </button>
</div>`,
  },
  {
    name: "🏆 3-Column Customer Reviews Grid",
    code: `<div class="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
  <div class="text-center space-y-1">
    <span class="text-xs font-black text-indigo-600 uppercase tracking-widest">Testimonials</span>
    <h3 class="text-lg font-black text-slate-900 dark:text-white">What Our Verified Buyers Say</h3>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
      <div class="flex text-amber-400 text-xs">★★★★★</div>
      <p class="text-xs text-slate-600 dark:text-slate-300 italic">"Fastest 24-hour delivery in Dhaka! Pressure cooker quality is 100% genuine."</p>
      <div class="text-[11px] font-bold text-slate-900 dark:text-white">— Tanvir A., Verified Buyer</div>
    </div>
    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
      <div class="flex text-amber-400 text-xs">★★★★★</div>
      <p class="text-xs text-slate-600 dark:text-slate-300 italic">"Best customer service & smooth order process. Highly recommended!"</p>
      <div class="text-[11px] font-bold text-slate-900 dark:text-white">— Nusrat J., Chittagong</div>
    </div>
    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
      <div class="flex text-amber-400 text-xs">★★★★★</div>
      <p class="text-xs text-slate-600 dark:text-slate-300 italic">"Great discounts on TWS earbuds and kitchen appliances."</p>
      <div class="text-[11px] font-bold text-slate-900 dark:text-white">— Rafiq M., Sylhet</div>
    </div>
  </div>
</div>`,
  },
  {
    name: "🎥 Embedded YouTube / Video Promo Hero",
    code: `<div class="w-full grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 items-center">
  <div class="md:col-span-6 space-y-3">
    <span class="text-xs font-black text-blue-400 uppercase tracking-widest">VIDEO SHOWCASE</span>
    <h2 class="text-2xl font-black text-white">Watch Product Unboxing & Usage Demo</h2>
    <p class="text-xs text-slate-400">See how BestBuy4UBd pressure cookers & air coolers perform in real kitchen testing.</p>
    <button class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition-all cursor-pointer">
      Watch Full Demo Video ▶
    </button>
  </div>
  <div class="md:col-span-6 aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
    <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Demo Video" frameborder="0" allowfullscreen></iframe>
  </div>
</div>`,
  },
];

export const SectionCustomizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"collection" | "layer" | "code_editor">("collection");
  const [layerSequence, setLayerSequence] = useState<SectionBlockConfig[]>(DEFAULT_BESTBUY_LAYER_SEQUENCE);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // CODE EDITOR DEDICATED PAGE STATE
  const [editingCodeSecId, setEditingCodeSecId] = useState<string | null>(null);
  const [codeBuffer, setCodeBuffer] = useState<string>("");

  // Load saved sequence from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bestbuy_home_layer_sequence");
      if (saved) {
        setLayerSequence(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Toggle selection from Collection page
  const handleToggleCollectionItem = (type: SectionBlockConfig["type"]) => {
    const isCurrentlySelected = layerSequence.some((s) => s.type === type);

    if (isCurrentlySelected) {
      setLayerSequence((prev) => prev.filter((s) => s.type !== type));
      toast.info("Unselected component section");
    } else {
      const def = PREMADE_SECTIONS_COLLECTION.find((p) => p.type === type);
      const newSec: SectionBlockConfig = {
        id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        type: type,
        title: def ? def.name.replace(/^[^\s]+\s*/, "") : "Custom Section",
        isActive: true,
        customCode: type === "custom_code" ? DEFAULT_CUSTOM_CODE_TEMPLATE : undefined,
      };
      setLayerSequence((prev) => [...prev, newSec]);
      toast.success(`Selected "${def?.name}" for Home Page!`);

      if (type === "custom_code") {
        setEditingCodeSecId(newSec.id);
        setCodeBuffer(DEFAULT_CUSTOM_CODE_TEMPLATE);
        setActiveTab("code_editor");
      }
    }
  };

  // Open Code Editor Studio Dedicated Page
  const handleOpenCodeEditor = (sec: SectionBlockConfig) => {
    setEditingCodeSecId(sec.id);
    setCodeBuffer(sec.customCode || DEFAULT_CUSTOM_CODE_TEMPLATE);
    setActiveTab("code_editor");
  };

  // Save Code Buffer to section
  const handleSaveCustomCode = () => {
    if (!editingCodeSecId) return;
    setLayerSequence((prev) =>
      prev.map((s) => (s.id === editingCodeSecId ? { ...s, customCode: codeBuffer } : s))
    );
    toast.success("Custom Code Section updated!");
  };

  // Drag Start on Layer Canvas
  const handleCanvasDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", `${index}`);
    e.dataTransfer.effectAllowed = "move";
  };

  // Drag Over
  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTargetIndex !== targetIndex) {
      setDropTargetIndex(targetIndex);
    }
  };

  // Drop Handler on Layer Canvas
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const fromIndex = parseInt(data, 10);

    if (!isNaN(fromIndex) && fromIndex !== targetIndex && fromIndex >= 0 && fromIndex < layerSequence.length) {
      const updated = [...layerSequence];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(targetIndex, 0, movedItem);
      setLayerSequence(updated);
      toast.success("Section reordered!");
    }

    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // Toggle Visibility
  const handleToggleActive = (id: string) => {
    setLayerSequence((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Remove Section
  const handleRemoveSection = (id: string, title: string) => {
    setLayerSequence((prev) => prev.filter((s) => s.id !== id));
    toast.info(`Removed "${title}"`);
  };

  // Save Layer Sequence
  const handleSaveLayer = () => {
    try {
      localStorage.setItem("bestbuy_home_layer_sequence", JSON.stringify(layerSequence));
      toast.success("Storefront Home Page layout saved!");
    } catch (e) {
      toast.error("Failed to save layout.");
    }
  };

  // Reset Layer Sequence
  const handleResetLayer = () => {
    setLayerSequence(DEFAULT_BESTBUY_LAYER_SEQUENCE);
    localStorage.removeItem("bestbuy_home_layer_sequence");
    toast.info("Reset home layout to default.");
  };

  return (
    <div className="w-full relative min-h-[700px]">
      {/* ========================================================================= */}
      {/* PAGE 1: COMPONENT COLLECTION VIEW */}
      {/* ========================================================================= */}
      {activeTab === "collection" && (
        <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Storefront Home Sections Customizer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select section components from the collection or create custom HTML/Tailwind/JSX code sections.
              </p>
            </div>

            {/* View Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
              <button
                onClick={() => setActiveTab("collection")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs cursor-pointer"
              >
                <Grid className="w-4 h-4 text-indigo-500" /> Component Collection
              </button>
              <button
                onClick={() => setActiveTab("layer")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <Layers className="w-4 h-4 text-purple-500" /> Layer Page Workspace
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center ml-1">
                  {layerSequence.length}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Sections to Include on Storefront ({layerSequence.length} Selected)
            </h3>
            <Button variant="primary" size="sm" onClick={() => setActiveTab("layer")}>
              Go to Layer Page <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-6 w-full">
            {PREMADE_SECTIONS_COLLECTION.map((template) => {
              const isSelected = layerSequence.some((s) => s.type === template.type);

              return (
                <div
                  key={template.type}
                  onClick={() => handleToggleCollectionItem(template.type)}
                  className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer w-full ${
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  {/* Select Radio Button (Top Right Overlay) */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-white bg-white text-indigo-600" : "border-slate-400"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{isSelected ? "Selected" : "Select Section"}</span>
                    </div>
                  </div>

                  {/* Section Component Rendering directly inside container */}
                  <div className="w-full pointer-events-none">
                    <RenderSectionPlaceholder
                      config={{
                        id: `col-${template.type}`,
                        type: template.type,
                        title: template.name,
                        isActive: true,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: LAYER PAGE WORKSPACE (Full Page Storefront + Only Back Option) */}
      {/* ========================================================================= */}
      {activeTab === "layer" && (
        <div className="space-y-4 w-full">
          {/* ONLY BACK OPTION HEADER BAR */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setActiveTab("collection")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-black transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Component Collection</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Viewport Toggles */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewportMode("desktop")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === "desktop"
                      ? "bg-indigo-600 text-white shadow-xs"
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
                      ? "bg-indigo-600 text-white shadow-xs"
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
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <Button variant="outline" size="sm" onClick={handleResetLayer}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveLayer}>
                <Save className="w-3.5 h-3.5 mr-1" /> Save Home Layout
              </Button>
            </div>
          </div>

          {/* FULL PAGE STOREFRONT HOME LAYOUT */}
          <div className="w-full bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto min-h-[800px] flex justify-center">
            <div
              className={`transition-all duration-300 space-y-4 w-full ${
                viewportMode === "desktop"
                  ? "max-w-full"
                  : viewportMode === "tablet"
                  ? "max-w-[720px]"
                  : "max-w-[380px]"
              }`}
            >
              {layerSequence.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800">
                  <Grid className="w-8 h-8 text-indigo-500 mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No sections added to Layer Page
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Click the floating <strong>+ Add Section</strong> button on bottom-right to add sections.
                  </p>
                </div>
              ) : (
                layerSequence.map((sec, index) => {
                  const isBeingDragged = draggedIndex === index;
                  const isDropTarget = dropTargetIndex === index;

                  return (
                    <div
                      key={sec.id}
                      draggable
                      onDragStart={(e) => handleCanvasDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group relative transition-all duration-200 ${
                        isBeingDragged
                          ? "opacity-30 scale-98"
                          : isDropTarget
                          ? "ring-2 ring-indigo-500 shadow-xl rounded-2xl"
                          : ""
                      }`}
                    >
                      {/* HOVER-ONLY FLOATING DRAG & EDIT CODE TOOLBAR */}
                      <div className="absolute top-3 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 text-white shadow-2xl backdrop-blur-sm border border-slate-700/60 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-indigo-400" />
                        <span className="text-[11px] font-black tracking-wide pr-1">
                          Drag Section #{index + 1}
                        </span>

                        {/* Edit Code Button for Custom Code Section */}
                        {sec.type === "custom_code" && (
                          <button
                            onClick={() => handleOpenCodeEditor(sec)}
                            className="px-2.5 py-0.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                            title="Open Full Page Code Studio"
                          >
                            <Code className="w-3 h-3" /> Edit Code
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleActive(sec.id)}
                          className="p-1 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
                          title={sec.isActive ? "Hide Section" : "Show Section"}
                        >
                          {sec.isActive ? (
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveSection(sec.id, sec.title)}
                          className="p-1 rounded-full hover:bg-red-900/60 text-slate-300 hover:text-red-400 transition-colors"
                          title="Remove Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Section renders matching home page layout */}
                      <div className={`transition-all ${!sec.isActive ? "opacity-30 grayscale" : ""}`}>
                        <RenderSectionPlaceholder config={sec} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* FLOATING "ADD SECTION" BUTTON */}
          <div className="fixed bottom-8 right-8 z-40">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider shadow-2xl shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-white/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>+ Add Section</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: DEDICATED FULL-PAGE CUSTOM CODE STUDIO WORKSPACE */}
      {/* ========================================================================= */}
      {activeTab === "code_editor" && (
        <div className="space-y-6 w-full">
          {/* Top Bar for Code Studio Page */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("layer")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Layer Workspace
              </button>
              <div className="h-6 w-px bg-slate-700 hidden sm:block" />
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                Custom Code Studio (Full Width HTML / Tailwind / JSX)
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Starter Template Selector */}
              <select
                onChange={(e) => {
                  const tmpl = STARTER_CODE_TEMPLATES.find((t) => t.name === e.target.value);
                  if (tmpl) {
                    setCodeBuffer(tmpl.code);
                    toast.success(`Loaded "${tmpl.name}" template!`);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="">-- Load Starter Snippet --</option>
                {STARTER_CODE_TEMPLATES.map((tmpl, idx) => (
                  <option key={idx} value={tmpl.name}>
                    {tmpl.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setCodeBuffer(DEFAULT_CUSTOM_CODE_TEMPLATE)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Reset Default
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleSaveCustomCode();
                  setActiveTab("layer");
                }}
              >
                <Save className="w-4 h-4 mr-1" /> Save & Back to Layer Page
              </Button>
            </div>
          </div>

          {/* SECTION 1: FULL WIDTH CODE EDITOR TEXTAREA */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl w-full">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-300 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" /> 100% Full Width Code Editor Studio
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {codeBuffer.length} chars | Tailwind CSS v4 Active
              </span>
            </div>

            <textarea
              value={codeBuffer}
              onChange={(e) => setCodeBuffer(e.target.value)}
              placeholder="Enter custom HTML / Tailwind / JSX code..."
              className="w-full h-80 p-5 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs border border-slate-800 focus:border-purple-500 focus:outline-none resize-y leading-relaxed shadow-inner"
              spellCheck={false}
            />
          </div>

          {/* SECTION 2: FULL WIDTH STOREFRONT LIVE PREVIEW */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xl w-full">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Storefront Live Render Preview (100% Full Width)
              </span>
              <span className="text-[10px] text-slate-400">Real-Time Responsive Render</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex justify-center min-h-[220px]">
              {codeBuffer.trim() === "" ? (
                <div className="text-center text-slate-500 py-10 space-y-1">
                  <Code className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs font-bold">Code editor buffer is empty</p>
                </div>
              ) : (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{
                    __html: codeBuffer.replace(/className=/g, "class="),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SECTION COMPONENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl space-y-4 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Add Section Component to Layer
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-2.5 flex-1">
              {PREMADE_SECTIONS_COLLECTION.map((template) => (
                <div
                  key={template.type}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500/60 hover:bg-white dark:hover:bg-slate-900 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    {template.type === "custom_code" && (
                      <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-black uppercase">
                        IDE CODE
                      </span>
                    )}
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {template.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const newSec: SectionBlockConfig = {
                        id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                        type: template.type,
                        title: template.name.replace(/^[^\s]+\s*/, ""),
                        isActive: true,
                        customCode: template.type === "custom_code" ? DEFAULT_CUSTOM_CODE_TEMPLATE : undefined,
                      };
                      setLayerSequence((prev) => [...prev, newSec]);
                      setIsModalOpen(false);
                      toast.success(`Added "${template.name}" to Layer Page!`);

                      if (template.type === "custom_code") {
                        setEditingCodeSecId(newSec.id);
                        setCodeBuffer(DEFAULT_CUSTOM_CODE_TEMPLATE);
                        setActiveTab("code_editor");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Close Modal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
