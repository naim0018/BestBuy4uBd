import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  FileText,
  Download,
  CornerDownRight,
  Reply,
  Info,
  ChevronDown,
  Facebook,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Conversation, Message, MessageType, ConversationStatus, MessageReplyReference } from "../types";
import { toast } from "sonner";

interface ChatViewProps {
  conversation: Conversation | null;
  onSendMessage: (
    text: string,
    type?: MessageType,
    mediaUrl?: string,
    fileName?: string,
    replyTo?: MessageReplyReference
  ) => void;
  onUpdateStatus: (status: ConversationStatus) => void;
  onReassignAgent: (agentName: string) => void;
  onToggleInfoPanel: () => void;
  isInfoPanelOpen: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  onSendMessage,
  onUpdateStatus,
  onReassignAgent,
  onToggleInfoPanel,
  isInfoPanelOpen,
}) => {
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<MessageReplyReference | null>(null);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-8 text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-slate-200/80 flex items-center justify-center text-slate-400 mb-3">
          <MessageSquare className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No conversation selected</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Pick a conversation from the left to start responding
        </p>
      </div>
    );
  }

  const handleInitiateReply = (targetMsg: Message) => {
    setReplyingTo({
      id: targetMsg.id,
      senderName: targetMsg.senderName,
      text: targetMsg.text || (targetMsg.fileName ? `Document: ${targetMsg.fileName}` : "Attachment"),
    });
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText, "text", undefined, undefined, replyingTo || undefined);
    setInputText("");
    setReplyingTo(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: MessageType) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info(`Uploading ${file.name}...`);
      setTimeout(() => {
        onSendMessage(
          `Shared document: ${file.name}`,
          type,
          URL.createObjectURL(file),
          file.name
        );
        toast.success(`Attached ${file.name}`);
      }, 500);
    }
  };

  const isMessenger = conversation.channel === "messenger";
  const agentList = [
    { name: "Naim", role: "Primary Support Lead" },
    { name: "Ayesha Khan", role: "Customer Success" },
    { name: "Tanvir Hasan", role: "Logistics Specialist" },
    { name: "Support Pool (Unassigned)", role: "Tier-1 Queue" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]/50 h-full min-w-0 relative">
      {/* 1. Conversation Header */}
      <div className="h-14 px-5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={conversation.customer.avatar}
              alt={conversation.customer.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
            />
            {conversation.customer.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 ring-2 ring-white rounded-full" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {conversation.customer.name}
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${
                  isMessenger ? "bg-[#0084FF]" : "bg-[#25D366]"
                }`}
              >
                {isMessenger ? (
                  <>
                    <Facebook className="w-2.5 h-2.5" />
                    Messenger
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-2.5 h-2.5" />
                    WhatsApp
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span className="text-emerald-600 font-medium">
                {conversation.customer.isOnline ? "Active now" : conversation.customer.lastActive || "Offline"}
              </span>
              <span>•</span>
              <span className="truncate">
                Assigned to: <strong className="text-slate-700 font-semibold">{conversation.assignedAgent.name}</strong>
              </span>
              <span>•</span>
              <span className="capitalize font-medium text-slate-500">
                {conversation.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons on Right */}
        <div className="flex items-center gap-1.5">
          {/* Assign dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAssignDropdown(!showAssignDropdown)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              Assign
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showAssignDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                  Assign Agent
                </div>
                {agentList.map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => {
                      onReassignAgent(agent.name);
                      setShowAssignDropdown(false);
                      toast.success(`Assigned to ${agent.name}`);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex flex-col cursor-pointer ${
                      conversation.assignedAgent.name === agent.name
                        ? "bg-blue-50/50 font-semibold text-blue-600"
                        : "text-slate-700"
                    }`}
                  >
                    <span>{agent.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{agent.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Quick Buttons */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              {conversation.status === "resolved" ? "Resolved" : conversation.status === "pending" ? "Pending" : "Open"}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30">
                <button
                  onClick={() => {
                    onUpdateStatus("open");
                    setShowStatusDropdown(false);
                    toast.info("Marked as Open");
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Open
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus("pending");
                    setShowStatusDropdown(false);
                    toast.info("Marked as Pending");
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pending
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus("resolved");
                    setShowStatusDropdown(false);
                    toast.success("Resolved conversation");
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-semibold cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Resolve
                </button>
              </div>
            )}
          </div>

          {/* Toggle Customer Info Panel */}
          <button
            onClick={onToggleInfoPanel}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              isInfoPanelOpen
                ? "bg-slate-900 text-white border-slate-900"
                : "text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50"
            }`}
            title="Toggle customer details panel"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Message History Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-center my-1">
          <span className="text-[10px] font-medium text-slate-400 bg-white px-3 py-0.5 rounded-full border border-slate-200/80 shadow-2xs">
            {conversation.conversationStarted}
          </span>
        </div>

        {conversation.messages.map((msg) => {
          const isAgent = msg.sender === "agent";

          return (
            <div
              key={msg.id}
              className={`group flex items-end gap-1.5 ${isAgent ? "justify-end" : "justify-start"}`}
            >
              {!isAgent && (
                <img
                  src={conversation.customer.avatar}
                  alt={msg.senderName}
                  className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                />
              )}

              {/* For Agent message: reply button to the left on hover */}
              {isAgent && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center mb-5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleInitiateReply(msg)}
                    className="p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-200/80 transition-colors shadow-2xs cursor-pointer"
                    title="Reply / Quote message"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className={`max-w-[70%] space-y-1 ${isAgent ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isAgent
                      ? "bg-blue-600 text-white rounded-br-xs shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  {/* Quoted message block */}
                  {msg.replyTo && (
                    <div
                      className={`text-[11px] p-2 rounded-lg border-l-2 flex items-start gap-1.5 mb-2 ${
                        isAgent
                          ? "bg-blue-700/60 text-white border-white/80 shadow-2xs"
                          : "bg-slate-100 text-slate-700 border-blue-500 shadow-2xs"
                      }`}
                    >
                      <CornerDownRight
                        className={`w-3 h-3 shrink-0 mt-0.5 ${isAgent ? "text-blue-200" : "text-slate-400"}`}
                      />
                      <div className="min-w-0">
                        <span
                          className={`font-semibold block text-[10px] ${
                            isAgent ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {msg.replyTo.senderName}
                        </span>
                        <p
                          className={`line-clamp-1 italic text-[11px] ${
                            isAgent ? "text-blue-100" : "text-slate-600"
                          }`}
                        >
                          {msg.replyTo.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {msg.type === "document" && (
                    <div className="flex items-center gap-2.5 p-2 bg-blue-700/40 rounded-xl mb-1.5 border border-white/20">
                      <FileText className="w-5 h-5 text-blue-200 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs truncate text-white">{msg.fileName}</p>
                        <p className="text-[10px] text-blue-100">{msg.fileSize}</p>
                      </div>
                      <Download className="w-4 h-4 text-blue-100 cursor-pointer hover:text-white" />
                    </div>
                  )}

                  {msg.type === "image" && msg.mediaUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden max-h-56 border border-slate-200">
                      <img src={msg.mediaUrl} alt="attachment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                <div
                  className={`flex items-center gap-1.5 text-[10px] px-1 text-slate-400 ${
                    isAgent ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isAgent && (
                    <span className="flex items-center">
                      {msg.status === "sending" && <Clock className="w-3 h-3 text-slate-400 animate-spin" />}
                      {msg.status === "sent" && <Check className="w-3 h-3 text-slate-400" />}
                      {msg.status === "delivered" && <CheckCheck className="w-3.5 h-3.5 text-slate-400" />}
                      {msg.status === "read" && (
                        <CheckCheck
                          className={`w-3.5 h-3.5 ${isMessenger ? "text-blue-500" : "text-emerald-500"}`}
                        />
                      )}
                      {msg.status === "failed" && (
                        <span className="flex items-center gap-1 text-red-500 font-medium cursor-pointer">
                          <AlertTriangle className="w-3 h-3" />
                          Failed · Retry
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* For Customer message: reply button to the right on hover */}
              {!isAgent && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center mb-5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleInitiateReply(msg)}
                    className="p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-200/80 transition-colors shadow-2xs cursor-pointer"
                    title="Reply / Quote message"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Modern Floating Composer Section */}
      <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
        {replyingTo && (
          <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border-l-4 border-blue-600 border border-slate-200 rounded-lg mb-2 text-xs shadow-2xs">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Reply className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-slate-800">
                  Replying to <span className="text-blue-600 font-bold">{replyingTo.senderName}</span>
                </span>
                <p className="text-slate-600 text-xs truncate max-w-md italic">{replyingTo.text}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 p-1 rounded text-xs cursor-pointer transition-colors"
              title="Cancel reply"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-2">
          <div className="relative rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Write a message to ${conversation.customer.name}...`}
              className="w-full resize-none p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent leading-relaxed"
            />

            {/* Actions Bar inside composer container */}
            <div className="flex items-center justify-between px-2.5 pb-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "document")}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Attach Document"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>

                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "image")}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Attach Image"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + " 😊");
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Emoji"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>

                <div className="h-3 w-px bg-slate-200 mx-1" />

                <button
                  type="button"
                  onClick={() => {
                    setInputText("Hello! We have confirmed your order and scheduled it for dispatch via Steadfast courier today. Thank you for shopping with BestBuy4u BD!");
                  }}
                  className="px-2 py-0.5 text-[10px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Order Confirmed Reply
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Enter ↵ to send
                </span>
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    inputText.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
