'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMessagesStore } from '@/store/messages';
import { useAuthStore } from '@/store/auth';

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

export default function SellerMessagesPage() {
  const { user } = useAuthStore();
  const {
    threads,
    messages,
    isLoading,
    isSending,
    fetchThreads,
    fetchMessages,
    sendMessage,
  } = useMessagesStore();

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const filteredThreads = threads.filter(
    (t) =>
      t.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch threads on mount + poll every 30s
  useEffect(() => {
    fetchThreads();
    const interval = setInterval(fetchThreads, 30000);
    return () => clearInterval(interval);
  }, [fetchThreads]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeThreadId]);

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setMobileView('conversation');
    fetchMessages(threadId);
  };

  const handleSend = () => {
    if (!messageInput.trim() || !activeThreadId || isSending) return;
    const body = messageInput;
    setMessageInput('');
    sendMessage(activeThreadId, body);
  };

  const handleBackToList = () => {
    setMobileView('list');
    setActiveThreadId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
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
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Thread Items */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && threads.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <ImageIcon className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0',
                    activeThreadId === thread.id && 'bg-primary-50'
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {thread.participant.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {thread.participant.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {timeAgo(thread.lastMessage.sentAt)}
                      </span>
                    </div>
                    <p className="text-xs text-accent truncate">{thread.listingTitle}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage.body}</p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <Badge className="bg-accent text-white border-0 text-[10px] h-5 min-w-[20px] justify-center shrink-0">
                      {thread.unreadCount}
                    </Badge>
                  )}
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
          {activeThread ? (
            <>
              {/* Conversation Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border shrink-0">
                <button
                  onClick={handleBackToList}
                  className="p-1 rounded-lg hover:bg-muted transition-colors md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {activeThread.participant.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {activeThread.participant.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{activeThread.listingTitle}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[75%] rounded-2xl px-4 py-2.5',
                            isMine
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-muted text-foreground rounded-bl-md'
                          )}
                        >
                          <p className="text-sm">{msg.body}</p>
                          <p
                            className={cn(
                              'text-[10px] mt-1',
                              isMine ? 'text-white/60' : 'text-muted-foreground'
                            )}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              <div className="p-3 border-t border-border shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 h-10 px-4 rounded-full border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    variant="accent"
                    size="icon"
                    className="rounded-full shrink-0"
                    disabled={!messageInput.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">Select a conversation</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a thread from the left to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
