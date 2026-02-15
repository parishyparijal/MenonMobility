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
  fetchUnreadCount: () => Promise<void>;
  setActiveThread: (thread: MessageThread | null) => void;
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
      set({ threads: response.data || [], isLoading: false });
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
      set({ messages: response.data || [], isLoading: false });

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
      const newMessage = response.data;
      set((state) => ({
        messages: [...state.messages, newMessage],
        isSending: false,
        threads: state.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                lastMessage: {
                  body,
                  sentAt: new Date().toISOString(),
                  isRead: false,
                  senderId: 'me',
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
