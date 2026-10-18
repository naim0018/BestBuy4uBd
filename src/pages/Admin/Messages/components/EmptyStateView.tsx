import React from "react";
import {
  Facebook,
  MessageSquare,
  Plus,
  RefreshCw,
  AlertCircle,
  WifiOff,
  Inbox,
  Search,
} from "lucide-react";
import { ChannelType } from "../types";

export interface EmptyStateViewProps {
  type:
    | "no_account_connected"
    | "no_conversations"
    | "no_conversation_selected"
    | "no_search_results"
    | "disconnected_account"
    | "api_error";
  channel: ChannelType;
  onConnectAccount?: () => void;
  onReconnect?: () => void;
  onResetSearch?: () => void;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  type,
  channel,
  onConnectAccount,
  onReconnect,
  onResetSearch,
}) => {
  const isMessenger = channel === "messenger";

  if (type === "no_account_connected") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs m-6">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ring-8 ${
            isMessenger
              ? "bg-blue-50 text-blue-600 ring-blue-50/50"
              : "bg-emerald-50 text-emerald-600 ring-emerald-50/50"
          }`}
        >
          {isMessenger ? <Facebook className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">
          {isMessenger ? "No Facebook Page Connected" : "No WhatsApp Account Connected"}
        </h3>

        <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
          {isMessenger
            ? "Connect your Facebook Page to manage Messenger conversations directly from your dashboard."
            : "Connect your WhatsApp Business account to manage customer conversations directly from your dashboard."}
        </p>

        <button
          onClick={onConnectAccount}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs text-white flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer ${
            isMessenger
              ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
          }`}
        >
          <Plus className="w-4 h-4" />
          {isMessenger ? "Connect Facebook Page" : "Connect WhatsApp Business"}
        </button>
      </div>
    );
  }

  if (type === "disconnected_account") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-amber-200/80 m-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <WifiOff className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Account Disconnected</h3>
        <p className="text-xs text-slate-500 max-w-sm mb-5">
          Access token expired or permission revoked by Facebook/Meta security policy.
        </p>
        <button
          onClick={onReconnect}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reconnect Account
        </button>
      </div>
    );
  }

  if (type === "api_error") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-red-200/80 m-6">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">API Connection Error</h3>
        <p className="text-xs text-slate-500 max-w-sm mb-5">
          Could not communicate with Meta Graph API servers. Please check your outbound connection or token credentials.
        </p>
        <button
          onClick={onReconnect}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  if (type === "no_search_results") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <Search className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">No matching conversations</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mb-4">
          We couldn’t find any conversations matching your filter criteria.
        </p>
        {onResetSearch && (
          <button
            onClick={onResetSearch}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
          >
            Reset Filters & Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
      <Inbox className="w-10 h-10 text-slate-300 mb-2" />
      <h4 className="text-sm font-semibold text-slate-700">Inbox is empty</h4>
      <p className="text-xs text-slate-400 mt-1 max-w-xs">
        No new conversations have arrived on this channel yet.
      </p>
    </div>
  );
};
