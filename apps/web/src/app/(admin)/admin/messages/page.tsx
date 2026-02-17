'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Send,
  ArrowLeft,
  MessageSquare,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

/* ─── Types ─── */

interface ThreadItem {
  id: string;
  buyer: { id: string; name: string; email: string; avatarUrl?: string };
  seller: { id: string; name: string; email: string; avatarUrl?: string };
  listing: { id: string; title: string; slug: string; image?: string | null };
  lastMessage: {
    id: string;
    body: string;
    senderId: string;
    isRead: boolean;
    createdAt: string;
  } | null;
  lastMessageAt: string;
  createdAt: string;
}

interface ThreadMessage {
  id: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface ThreadDetail {
  thread: {
    id: string;
    buyer: { id: string; name: string; avatarUrl?: string };
    seller: { id: string; name: string; avatarUrl?: string };
    listing: { id: string; title: string; slug: string };
    createdAt: string;
  };
  messages: ThreadMessage[];
}

/* ─── Helpers ─── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/* ─── Component ─── */

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ThreadDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch threads
  const fetchThreads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');
      if (searchQuery) params.set('search', searchQuery);
      const res = await api.get<any>(`/admin/messages?${params.toString()}`);
      if (res?.success) setThreads(res.data || []);
    } catch {
      // silently fail
    } finally {
      setThreadsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setThreadsLoading(true);
    fetchThreads();
    const interval = setInterval(fetchThreads, 30000);
    return () => clearInterval(interval);
  }, [fetchThreads]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch thread detail
  const handleSelectThread = async (threadId: string) => {
    setActiveThreadId(threadId);
    setMobileView('conversation');
    setDetailLoading(true);
    try {
      const res = await api.get<any>(`/admin/messages/${threadId}`);
      if (res?.success) setDetail(res.data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detail?.messages?.length, activeThreadId]);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Monitor all buyer-seller conversations ({threads.length} threads)
        </p>
      </div>

      <div className="flex-1 flex bg-white rounded-xl border border-border overflow-hidden min-h-0">
        {/* Thread List */}
        <div
          className={cn(
            'w-full md:w-80 lg:w-96 border-r border-border flex flex-col shrink-0',
            mobileView === 'conversation' ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by buyer, seller, or listing..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Thread Items */}
          <div className="flex-1 overflow-y-auto">
            {threadsLoading && threads.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageSquare className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No conversations found</p>
              </div>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0',
                    activeThreadId === thread.id && 'bg-primary-50'
                  )}
                >
                  {/* Listing thumbnail */}
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {thread.listing.image ? (
                      <img
                        src={thread.listing.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground truncate">
                        {thread.buyer.name} &rarr; {thread.seller.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {timeAgo(thread.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-accent truncate">{thread.listing.title}</p>
                    {thread.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {thread.lastMessage.body}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation Panel */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0',
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          )}
        >
          {activeThread && detail ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border shrink-0">
                <button
                  onClick={() => {
                    setMobileView('list');
                    setActiveThreadId(null);
                  }}
                  className="p-1 rounded-lg hover:bg-muted transition-colors md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {detail.thread.listing.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-primary">{detail.thread.buyer.name}</span>
                    {' '}&rarr;{' '}
                    <span className="font-medium text-primary">{detail.thread.seller.name}</span>
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {detail.messages.length} messages
                </Badge>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {detailLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  detail.messages.map((msg) => {
                    const isBuyer = msg.senderId === detail.thread.buyer.id;
                    const senderName = isBuyer
                      ? detail.thread.buyer.name
                      : detail.thread.seller.name;
                    return (
                      <div key={msg.id} className={cn('flex', isBuyer ? 'justify-start' : 'justify-end')}>
                        <div
                          className={cn(
                            'max-w-[75%] rounded-2xl px-4 py-2.5',
                            isBuyer
                              ? 'bg-muted text-foreground rounded-bl-md'
                              : 'bg-primary text-white rounded-br-md'
                          )}
                        >
                          <p className={cn('text-[10px] font-semibold mb-0.5', isBuyer ? 'text-primary' : 'text-white/80')}>
                            {senderName} ({isBuyer ? 'Buyer' : 'Seller'})
                          </p>
                          <p className="text-sm">{msg.body}</p>
                          <p
                            className={cn(
                              'text-[10px] mt-1',
                              isBuyer ? 'text-muted-foreground' : 'text-white/60'
                            )}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' '}
                            {new Date(msg.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Admin read-only footer */}
              <div className="p-3 border-t border-border shrink-0 bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  Admin view &mdash; read-only monitoring
                </p>
              </div>
            </>
          ) : detailLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">Select a conversation</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a thread from the left to view the conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
