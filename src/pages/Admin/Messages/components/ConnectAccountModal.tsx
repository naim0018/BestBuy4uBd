import React, { useState } from "react";
import {
  X,
  Facebook,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ChannelType, ConnectedAccount } from "../types";
import { toast } from "sonner";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChannelType;
  onAddAccount: (account: ConnectedAccount) => void;
}

export const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({
  isOpen,
  onClose,
  channel,
  onAddAccount,
}) => {
  const [accountName, setAccountName] = useState("");
  const [accountIdentifier, setAccountIdentifier] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isMessenger = channel === "messenger";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim() || !accountIdentifier.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newAccount: ConnectedAccount = {
        id: `${isMessenger ? "fb_page" : "wa_num"}_${Date.now()}`,
        channel,
        name: accountName.trim(),
        identifier: accountIdentifier.trim(),
        status: "connected",
        avatar: isMessenger
          ? "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=120&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=120&auto=format&fit=crop&q=80",
        category: category.trim() || (isMessenger ? "BestBuy Retail Page" : "WhatsApp Business API"),
      };

      onAddAccount(newAccount);
      toast.success(
        isMessenger
          ? `Facebook Page "${newAccount.name}" connected successfully!`
          : `WhatsApp number "${newAccount.identifier}" registered successfully!`
      );
      setIsSubmitting(false);
      onClose();
      setAccountName("");
      setAccountIdentifier("");
      setCategory("");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isMessenger ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {isMessenger ? <Facebook className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isMessenger ? "Connect Facebook Page" : "Connect WhatsApp Business"}
              </h3>
              <p className="text-xs text-slate-500">
                {isMessenger
                  ? "Authorize your business Facebook page for instant 2-way messaging"
                  : "Link your Meta WhatsApp Cloud API credentials or phone number"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Direct Official Integration:</span>{" "}
              Messages will sync in real-time using webhook event streaming. Your customer records stay securely isolated in your BestBuy workspace.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isMessenger ? "Facebook Page Name *" : "Business / Display Name *"}
            </label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder={isMessenger ? "e.g. BestBuy4u BD Official" : "e.g. BestBuy Customer Care"}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isMessenger ? "Facebook Page ID / Username *" : "WhatsApp Phone Number (E.164) *"}
            </label>
            <input
              type="text"
              required
              value={accountIdentifier}
              onChange={(e) => setAccountIdentifier(e.target.value)}
              placeholder={isMessenger ? "e.g. FB-PAGE-992014 or @bestbuybd" : "e.g. +880 1711-234567"}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Department / Category (Optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Priority Support, Online Store, Sales Desk"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                isMessenger
                  ? "bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-blue-500/20"
                  : "bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-emerald-500/20"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {isMessenger ? "Connect Page" : "Connect Account"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
