export type ChannelType = "messenger" | "whatsapp";

export type ConversationStatus = "open" | "pending" | "resolved";

export type MessageType = "text" | "image" | "document" | "audio" | "link";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface ConnectedAccount {
  id: string;
  channel: ChannelType;
  name: string;
  identifier: string;
  status: "connected" | "disconnected" | "error";
  avatar: string;
  category?: string;
}

export interface MessageReplyReference {
  id: string;
  senderName: string;
  text: string;
}

export interface Message {
  id: string;
  sender: "customer" | "agent";
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  type: MessageType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: string;
  status: MessageStatus;
  replyTo?: MessageReplyReference;
}

export interface InternalNote {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface PreviousInteraction {
  id: string;
  date: string;
  channel: ChannelType;
  summary: string;
  status: ConversationStatus;
}

export interface Conversation {
  id: string;
  channel: ChannelType;
  accountId: string;
  customer: {
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    location?: string;
    isOnline?: boolean;
    lastActive?: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    sender: "customer" | "agent";
    status?: MessageStatus;
  };
  unreadCount: number;
  assignedAgent: {
    id: string;
    name: string;
    avatar: string;
  };
  status: ConversationStatus;
  tags: string[];
  conversationStarted: string;
  lastInteraction: string;
  messages: Message[];
  internalNotes: InternalNote[];
  previousConversations: PreviousInteraction[];
}
