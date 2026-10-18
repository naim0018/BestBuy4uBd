import React from "react";
import {
  Search,
  Inbox,
  User,
  Facebook,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Conversation } from "../types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "open", label: "Open" },
    { id: "pending", label: "Pending" },
    { id: "resolved", label: "Resolved" },
    { id: "assigned_to_me", label: "Assigned" },
  ];

  return (
    <div className="w-[330px] border-r border-slate-200/80 bg-white flex flex-col h-full shrink-0 select-none">
      {/* Header Search & Filter */}
      <div className="p-3 border-b border-slate-100 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customer, phone, message..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-normal"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 px-1 font-semibold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100/70">
        {conversations.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center h-52 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-2 text-slate-300">
              <Inbox className="w-5 h-5 stroke-[1.5]" />
            </div>
            <p className="text-xs font-semibold text-slate-700">No conversations</p>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-[180px]">
              No matching inquiries found for this filter
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = selectedConversationId === conv.id;
            const isMessenger = conv.channel === "messenger";

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-3 cursor-pointer transition-all relative flex items-start gap-3 border-l-[3px] ${
                  isSelected
                    ? "bg-blue-50/50 border-blue-600 shadow-2xs"
                    : "border-transparent hover:bg-slate-50/70"
                }`}
              >
                {/* Customer Avatar & Channel Badge */}
                <div className="relative shrink-0 mt-0.5">
                  <img
                    src={conv.customer.avatar}
                    alt={conv.customer.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  {conv.customer.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 ring-2 ring-white rounded-full" />
                  )}
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white ring-2 ring-white text-[9px] shadow-2xs ${
                      isMessenger ? "bg-[#0084FF]" : "bg-[#25D366]"
                    }`}
                  >
                    {isMessenger ? (
                      <Facebook className="w-2.5 h-2.5" />
                    ) : (
                      <MessageSquare className="w-2.5 h-2.5" />
                    )}
                  </div>
                </div>

                {/* Body Preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs truncate ${
                        conv.unreadCount > 0
                          ? "font-bold text-slate-900"
                          : isSelected
                          ? "font-bold text-blue-950"
                          : "font-semibold text-slate-800"
                      }`}
                    >
                      {conv.customer.name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                      {conv.lastMessage.timestamp}
                    </span>
                  </div>

                  <p
                    className={`text-xs truncate leading-relaxed ${
                      conv.unreadCount > 0
                        ? "font-semibold text-slate-900"
                        : "text-slate-500 font-normal"
                    }`}
                  >
                    {conv.lastMessage.text}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium truncate max-w-[110px]">
                        <User className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                        <span className="truncate">{conv.assignedAgent.name}</span>
                      </span>

                      <span
                        className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          conv.status === "open"
                            ? "bg-blue-50 text-blue-700"
                            : conv.status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {conv.status}
                      </span>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
