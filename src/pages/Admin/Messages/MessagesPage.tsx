import React, { useState, useMemo } from "react";
import {
  Facebook,
  MessageSquare,
  Plus,
  Sliders,
  Bell,
  ChevronDown,
  Radio,
} from "lucide-react";
import {
  ChannelType,
  ConnectedAccount,
  Conversation,
  ConversationStatus,
  MessageType,
  Message,
  MessageReplyReference,
} from "./types";
import { initialAccounts, initialConversations } from "./mockData";
import { ConversationList } from "./components/ConversationList";
import { ChatView } from "./components/ChatView";
import { CustomerContextPanel } from "./components/CustomerContextPanel";
import { ConnectAccountModal } from "./components/ConnectAccountModal";
import { SettingsModal } from "./components/SettingsModal";
import { EmptyStateView } from "./components/EmptyStateView";
import { toast } from "sonner";

export const MessagesPage: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>("messenger");
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(initialAccounts);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const [selectedAccountIds, setSelectedAccountIds] = useState<Record<ChannelType, string>>({
    messenger: "fb_page_1",
    whatsapp: "wa_num_1",
  });

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("conv-1");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<"connection" | "notifications">("connection");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const currentAgentName = "Naim";

  const channelAccounts = useMemo(() => {
    return accounts.filter((acc) => acc.channel === selectedChannel);
  }, [accounts, selectedChannel]);

  const activeAccount = useMemo(() => {
    const currentId = selectedAccountIds[selectedChannel];
    return channelAccounts.find((acc) => acc.id === currentId) || channelAccounts[0];
  }, [channelAccounts, selectedAccountIds, selectedChannel]);

  const unreadCounts = useMemo(() => {
    const counts = { messenger: 0, whatsapp: 0 };
    conversations.forEach((conv) => {
      counts[conv.channel] += conv.unreadCount;
    });
    return counts;
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((conv) => {
        if (conv.channel !== selectedChannel) return false;

        if (activeAccount && conv.accountId !== activeAccount.id) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = conv.customer.name.toLowerCase().includes(q);
          const matchesPhone = conv.customer.phone.includes(q);
          const matchesText = conv.lastMessage.text.toLowerCase().includes(q);
          const matchesTag = conv.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesPhone && !matchesText && !matchesTag) return false;
        }

        if (activeFilter === "unread") return conv.unreadCount > 0;
        if (activeFilter === "open") return conv.status === "open";
        if (activeFilter === "pending") return conv.status === "pending";
        if (activeFilter === "resolved") return conv.status === "resolved";
        if (activeFilter === "assigned_to_me") {
          return conv.assignedAgent.name.toLowerCase() === currentAgentName.toLowerCase();
        }

        return true;
      });
  }, [conversations, selectedChannel, activeAccount, searchQuery, activeFilter, currentAgentName]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  const handleSelectChannel = (channel: ChannelType) => {
    setSelectedChannel(channel);
    const targetAccountId = selectedAccountIds[channel];
    const firstConv = conversations.find(
      (c) => c.channel === channel && (!targetAccountId || c.accountId === targetAccountId)
    );
    setSelectedConversationId(firstConv?.id || null);
  };

  const handleSwitchAccount = (accountId: string) => {
    setSelectedAccountIds((prev) => ({
      ...prev,
      [selectedChannel]: accountId,
    }));
    setShowAccountDropdown(false);

    const convInAccount = conversations.find(
      (c) => c.channel === selectedChannel && c.accountId === accountId
    );
    setSelectedConversationId(convInAccount?.id || null);
    toast.info(`Switched active inbox view`);
  };

  const handleSendMessage = (
    text: string,
    type: MessageType = "text",
    mediaUrl?: string,
    fileName?: string,
    replyTo?: MessageReplyReference
  ) => {
    if (!activeConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "agent" as const,
      senderName: currentAgentName,
      text,
      timestamp: "Just now",
      type,
      mediaUrl,
      fileName,
      replyTo,
      status: "sending" as const,
    };

    setConversations((prev) => {
      const targetIndex = prev.findIndex((c) => c.id === activeConversation.id);
      if (targetIndex === -1) return prev;
      const updatedConv = {
        ...prev[targetIndex],
        lastMessage: {
          text,
          timestamp: "Just now",
          sender: "agent" as const,
          status: "sending" as const,
        },
        messages: [...prev[targetIndex].messages, newMsg],
      };
      const rest = prev.filter((c) => c.id !== activeConversation.id);
      return [updatedConv, ...rest];
    });

    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsg.id ? { ...m, status: "delivered" } : m
              ),
            };
          }
          return c;
        })
      );
    }, 1000);

    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsg.id ? { ...m, status: "read" } : m
              ),
            };
          }
          return c;
        })
      );
    }, 2400);
  };

  const handleUpdateStatus = (status: ConversationStatus) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversation.id ? { ...c, status } : c))
    );
  };

  const handleReassignAgent = (agentName: string) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              assignedAgent: {
                ...c.assignedAgent,
                name: agentName,
              },
            }
          : c
      )
    );
  };

  const handleAddTag = (tag: string) => {
    if (!activeConversation) return;
    if (activeConversation.tags.includes(tag)) {
      toast.error("Tag already exists");
      return;
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, tags: [...c.tags, tag] } : c
      )
    );
    toast.success(`Tag "${tag}" added`);
  };

  const handleRemoveTag = (tag: string) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, tags: c.tags.filter((t) => t !== tag) }
          : c
      )
    );
  };

  const handleAddNote = (noteText: string) => {
    if (!activeConversation) return;
    const newNote = {
      id: `note-${Date.now()}`,
      author: currentAgentName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      text: noteText,
      createdAt: "Just now",
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, internalNotes: [newNote, ...c.internalNotes] }
          : c
      )
    );
    toast.success("Internal note posted");
  };

  const handleAddAccount = (newAccount: ConnectedAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
    setSelectedAccountIds((prev) => ({
      ...prev,
      [newAccount.channel]: newAccount.id,
    }));
  };

  const triggerSimulatedInboundMessage = () => {
    const isMsg = selectedChannel === "messenger";
    const sampleCustomer = isMsg ? "Tahmid Hasan" : "Samira Rahman";
    const sampleText = isMsg
      ? "Hello BestBuy team! Can I order 2 units of headphones for delivery to Banani?"
      : "Assalamu Alaikum, I just confirmed payment for order #BB-9092.";

    const targetAccount = activeAccount || channelAccounts[0];

    const newConv: Conversation = {
      id: `conv-sim-${Date.now()}`,
      channel: selectedChannel,
      accountId: targetAccount ? targetAccount.id : "",
      customer: {
        id: `cust-sim-${Date.now()}`,
        name: sampleCustomer,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        email: `${sampleCustomer.toLowerCase().replace(" ", ".")}@example.com`,
        phone: "+880 1799-880011",
        location: "Banani Road 11, Dhaka",
        isOnline: true,
        lastActive: "Active now",
      },
      lastMessage: {
        text: sampleText,
        timestamp: "Just now",
        sender: "customer",
      },
      unreadCount: 1,
      assignedAgent: {
        id: "agent-1",
        name: currentAgentName,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      status: "open",
      tags: ["Incoming", "New Customer"],
      conversationStarted: "Today, Just now",
      lastInteraction: "Just now",
      messages: [
        {
          id: `m-sim-${Date.now()}`,
          sender: "customer",
          senderName: sampleCustomer,
          text: sampleText,
          timestamp: "Just now",
          type: "text",
          status: "read",
        },
      ],
      internalNotes: [],
      previousConversations: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setSelectedConversationId(newConv.id);
    toast.info(`🔔 New message from ${sampleCustomer} on ${selectedChannel === "messenger" ? "Facebook" : "WhatsApp"}`);
  };

  const isMessenger = selectedChannel === "messenger";

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* 1. COMPACT INTEGRATED CONTROL BAR */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Title + Status + Channel Pills */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Messages</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Primary Channel Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
            <button
              onClick={() => handleSelectChannel("messenger")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                selectedChannel === "messenger"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Facebook
                className={`w-3.5 h-3.5 ${
                  selectedChannel === "messenger" ? "text-[#0084FF]" : "text-slate-400"
                }`}
              />
              Messenger
              {unreadCounts.messenger > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white">
                  {unreadCounts.messenger}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectChannel("whatsapp")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                selectedChannel === "whatsapp"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageSquare
                className={`w-3.5 h-3.5 ${
                  selectedChannel === "whatsapp" ? "text-[#25D366]" : "text-slate-400"
                }`}
              />
              WhatsApp
              {unreadCounts.whatsapp > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-600 text-white">
                  {unreadCounts.whatsapp}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right: Connected Account Switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* Account switcher */}
          {channelAccounts.length > 0 && activeAccount && (
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-lg text-xs text-slate-700 transition-colors cursor-pointer"
              >
                <img
                  src={activeAccount.avatar}
                  alt={activeAccount.name}
                  className="w-4 h-4 rounded-md object-cover ring-1 ring-slate-200"
                />
                <span className="font-semibold text-slate-800 max-w-[130px] truncate">
                  {activeAccount.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                  {activeAccount.identifier}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showAccountDropdown && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-40">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                    Switch Connected {isMessenger ? "Facebook Page" : "WhatsApp Number"}
                  </div>
                  {channelAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => handleSwitchAccount(acc.id)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer ${
                        activeAccount.id === acc.id ? "bg-slate-50 font-bold" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-5 h-5 rounded-md object-cover"
                        />
                        <div className="truncate">
                          <p className="truncate text-slate-900 font-medium">{acc.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{acc.identifier}</p>
                        </div>
                      </div>
                      {activeAccount.id === acc.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setShowAccountDropdown(false);
                        setIsConnectModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {isMessenger ? "+ Connect Facebook Page" : "+ Connect WhatsApp Business"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isMessenger
                ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/70"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connect</span>
          </button>

          <button
            onClick={triggerSimulatedInboundMessage}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200/70 transition-colors cursor-pointer"
            title="Simulate Inbound Message"
          >
            <Radio className="w-3.5 h-3.5 text-blue-600" />
          </button>

          <button
            onClick={() => {
              setSettingsInitialTab("connection");
              setIsSettingsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200/70 transition-colors cursor-pointer"
            title="Connection & Webhook settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setSettingsInitialTab("notifications");
              setIsSettingsModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200/70 transition-colors cursor-pointer"
            title="Notification settings"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
        {channelAccounts.length === 0 ? (
          <EmptyStateView
            type="no_account_connected"
            channel={selectedChannel}
            onConnectAccount={() => setIsConnectModalOpen(true)}
          />
        ) : (
          <>
            {/* COLUMN 1: LEFT — CONVERSATION INBOX */}
            <ConversationList
              conversations={filteredConversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={(id) => {
                setSelectedConversationId(id);
                setConversations((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                );
              }}
              activeFilter={activeFilter}
              onFilterChange={(f) => setActiveFilter(f)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
            />

            {/* COLUMN 2: CENTER — ACTIVE CONVERSATION */}
            <ChatView
              conversation={activeConversation}
              onSendMessage={handleSendMessage}
              onUpdateStatus={handleUpdateStatus}
              onReassignAgent={handleReassignAgent}
              onToggleInfoPanel={() => setIsCustomerPanelOpen(!isCustomerPanelOpen)}
              isInfoPanelOpen={isCustomerPanelOpen}
            />

            {/* COLUMN 3: RIGHT — CUSTOMER INFORMATION */}
            {isCustomerPanelOpen && activeConversation && (
              <CustomerContextPanel
                conversation={activeConversation}
                onClose={() => setIsCustomerPanelOpen(false)}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                onAddNote={handleAddNote}
              />
            )}
          </>
        )}
      </div>

      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        channel={selectedChannel}
        onAddAccount={handleAddAccount}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialTab={settingsInitialTab}
      />
    </div>
  );
};

export default MessagesPage;
