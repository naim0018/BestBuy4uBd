import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Tag,
  Plus,
  StickyNote,
  History,
  MessageSquare,
  Facebook,
} from "lucide-react";
import { Conversation } from "../types";

interface CustomerContextPanelProps {
  conversation: Conversation;
  onClose: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onAddNote: (noteText: string) => void;
}

export const CustomerContextPanel: React.FC<CustomerContextPanelProps> = ({
  conversation,
  onClose,
  onAddTag,
  onRemoveTag,
  onAddNote,
}) => {
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState("");

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    onAddTag(newTagInput.trim());
    setNewTagInput("");
    setShowAddTag(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    onAddNote(newNoteInput.trim());
    setNewNoteInput("");
  };

  const isMessenger = conversation.channel === "messenger";

  return (
    <div className="w-[300px] border-l border-slate-200/80 bg-white flex flex-col h-full shrink-0 overflow-y-auto divide-y divide-slate-100 select-none">
      {/* Header Profile Summary */}
      <div className="p-4 flex flex-col items-center text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close details"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="relative mb-2.5">
          <img
            src={conversation.customer.avatar}
            alt={conversation.customer.name}
            className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs"
          />
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-white ring-2 ring-white text-[9px] shadow-2xs ${
              isMessenger ? "bg-[#0084FF]" : "bg-[#25D366]"
            }`}
          >
            {isMessenger ? <Facebook className="w-2.5 h-2.5" /> : <MessageSquare className="w-2.5 h-2.5" />}
          </div>
        </div>

        <h3 className="text-xs font-bold text-slate-900">{conversation.customer.name}</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {isMessenger ? "Messenger Customer" : "WhatsApp Business Contact"}
        </p>

        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-medium text-slate-600">
            {conversation.customer.isOnline ? "Active now" : conversation.customer.lastActive || "Offline"}
          </span>
        </div>
      </div>

      {/* 1. Contact Information */}
      <div className="p-4 space-y-2.5">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Contact Information
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="font-mono text-slate-800 text-[11px]">{conversation.customer.phone}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-slate-800 text-[11px] truncate">{conversation.customer.email}</span>
          </div>

          {conversation.customer.location && (
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-slate-800 text-[11px]">{conversation.customer.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Conversation Metadata */}
      <div className="p-4 space-y-2.5">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Conversation
        </h4>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500 text-[11px]">Status</span>
            <span
              className={`font-semibold capitalize px-2 py-0.2 rounded text-[10px] ${
                conversation.status === "open"
                  ? "bg-blue-50 text-blue-700"
                  : conversation.status === "pending"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {conversation.status}
            </span>
          </div>

          <div className="flex justify-between py-0.5">
            <span className="text-slate-500 text-[11px]">Assigned Agent</span>
            <span className="font-semibold text-slate-800 text-[11px]">{conversation.assignedAgent.name}</span>
          </div>

          <div className="flex justify-between py-0.5">
            <span className="text-slate-500 text-[11px]">First Contact</span>
            <span className="text-slate-700 text-[11px]">{conversation.conversationStarted}</span>
          </div>

          <div className="flex justify-between py-0.5">
            <span className="text-slate-500 text-[11px]">Last Activity</span>
            <span className="text-slate-700 text-[11px]">{conversation.lastInteraction}</span>
          </div>
        </div>
      </div>

      {/* 3. Tags Section */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Tags
          </h4>
          <button
            onClick={() => setShowAddTag(!showAddTag)}
            className="text-[10px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Add Tag
          </button>
        </div>

        {showAddTag && (
          <form onSubmit={handleAddTagSubmit} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Tag name..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-slate-800"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md font-medium cursor-pointer"
            >
              Add
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-1">
          {conversation.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[10px] font-medium rounded-md transition-colors group"
            >
              <Tag className="w-2.5 h-2.5 text-slate-400" />
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="text-slate-400 hover:text-red-500 font-bold ml-0.5 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 4. Internal Notes */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1.5">
          <StickyNote className="w-3 h-3 text-amber-500" />
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Internal Notes
          </h4>
        </div>

        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {conversation.internalNotes.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">No notes added yet.</p>
          ) : (
            conversation.internalNotes.map((note) => (
              <div
                key={note.id}
                className="p-2 bg-amber-50/60 border border-amber-200/50 rounded-lg text-xs space-y-0.5"
              >
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span className="font-semibold text-slate-700">{note.author}</span>
                  <span>{note.createdAt}</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-snug">{note.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddNoteSubmit} className="space-y-1 pt-1">
          <textarea
            rows={2}
            value={newNoteInput}
            onChange={(e) => setNewNoteInput(e.target.value)}
            placeholder="Write team note..."
            className="w-full resize-none p-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800"
          />
          <button
            type="submit"
            disabled={!newNoteInput.trim()}
            className={`w-full py-1 text-[11px] rounded-lg font-medium transition-all ${
              newNoteInput.trim()
                ? "bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            Post Note
          </button>
        </form>
      </div>

      {/* 5. Previous Conversations */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1.5">
          <History className="w-3 h-3 text-slate-400" />
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Past Interactions
          </h4>
        </div>

        <div className="space-y-1.5">
          {conversation.previousConversations.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">No previous history.</p>
          ) : (
            conversation.previousConversations.map((item) => (
              <div
                key={item.id}
                className="p-2 border border-slate-100 bg-slate-50/40 rounded-lg text-xs space-y-0.5 hover:border-slate-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    {item.channel === "messenger" ? (
                      <Facebook className="w-2.5 h-2.5 text-[#0084FF]" />
                    ) : (
                      <MessageSquare className="w-2.5 h-2.5 text-[#25D366]" />
                    )}
                    {item.date}
                  </span>
                  <span className="px-1 py-0.2 rounded text-[8px] font-semibold bg-emerald-50 text-emerald-700 capitalize">
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2 text-[10px]">{item.summary}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
