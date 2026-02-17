import { create } from 'zustand';
import { api } from '@/lib/api';

export interface MessageThread {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    body: string;
    sentAt: string;
    isRead: boolean;
    senderId: string;
  };
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface MessagesState {
  threads: MessageThread[];
  activeThread: MessageThread | null;
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  fetchThreads: () => Promise<void>;
  fetchMessages: (threadId: string) => Promise<void>;
  sendMessage: (threadId: string, body: string) => Promise<void>;
  sendFirstMessage: (listingId: string, body: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  setActiveThread: (thread: MessageThread | null) => void;
}

function mapApiThread(t: any): MessageThread {
  return {
    id: t.id,
    listingId: t.listing?.id || '',
    listingTitle: t.listing?.title || 'Unknown Listing',
    listingImage: t.listing?.images?.[0] || undefined,
    participant: {
      id: t.otherParty?.id || '',
      name: t.otherParty?.name || 'Unknown',
      avatar: t.otherParty?.avatarUrl || undefined,
    },
    lastMessage: {
      body: t.lastMessage?.body || '',
      sentAt: t.lastMessage?.createdAt || t.createdAt,
      isRead: t.lastMessage?.isRead ?? true,
      senderId: t.lastMessage?.senderId || '',
    },
    unreadCount: t.unreadCount ?? 0,
    createdAt: t.createdAt,
  };
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  threads: [],
  activeThread: null,
  messages: [],
  unreadCount: 0,
  isLoading: false,
  isSending: false,
  error: null,

  fetchThreads: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<any>('/messages');
      const apiThreads = response.data || [];
      set({ threads: apiThreads.map(mapApiThread), isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch threads',
      });
    }
  },

  fetchMessages: async (threadId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<any>(`/messages/${threadId}`);
      const data = response.data;
      const msgs: Message[] = (data?.messages || []).map((m: any) => ({
        id: m.id,
        threadId,
        senderId: m.senderId,
        body: m.body,
        isRead: m.isRead ?? false,
        createdAt: m.createdAt,
      }));
      set({ messages: msgs, isLoading: false });

      // Mark thread as read locally
      set((state) => ({
        threads: state.threads.map((t) =>
          t.id === threadId ? { ...t, unreadCount: 0 } : t
        ),
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
      });
    }
  },

  sendMessage: async (threadId: string, body: string) => {
    set({ isSending: true, error: null });
    try {
      const response = await api.post<any>('/messages', {
        threadId,
        body,
      });
      const msg = response.data;
      const newMessage: Message = {
        id: msg.id,
        threadId: msg.threadId || threadId,
        senderId: msg.senderId,
        body: msg.body,
        isRead: msg.isRead ?? false,
        createdAt: msg.createdAt,
      };
      set((state) => ({
        messages: [...state.messages, newMessage],
        isSending: false,
        threads: state.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                lastMessage: {
                  body: msg.body,
                  sentAt: msg.createdAt,
                  isRead: false,
                  senderId: msg.senderId,
                },
              }
            : t
        ),
      }));
    } catch (error) {
      set({
        isSending: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      });
    }
  },

  sendFirstMessage: async (listingId: string, body: string) => {
    set({ isSending: true, error: null });
    try {
      await api.post<any>('/messages', {
        listingId,
        body,
      });
      set({ isSending: false });
    } catch (error) {
      set({
        isSending: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      });
      throw error;
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await api.get<any>('/messages/unread');
      set({ unreadCount: response.data?.count ?? 0 });
    } catch {
      // silently fail
    }
  },

  setActiveThread: (thread) => {
    set({ activeThread: thread, messages: [] });
    if (thread) {
      get().fetchMessages(thread.id);
    }
  },
}));
