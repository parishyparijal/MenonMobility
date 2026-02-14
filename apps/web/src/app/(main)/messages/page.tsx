'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Search, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Thread {
  id: string;
  participant: { name: string; avatar: string };
  listingTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
}

const dummyThreads: Thread[] = [
  {
    id: '1',
    participant: { name: 'TransEuropa BV', avatar: '' },
    listingTitle: 'Mercedes-Benz Actros 2545 LS 6x2',
    lastMessage: 'Yes, the truck is still available. Would you like to schedule a viewing?',
    lastMessageTime: '2 hours ago',
    unreadCount: 1,
  },
  {
    id: '2',
    participant: { name: 'Nordic Trucks GmbH', avatar: '' },
    listingTitle: 'Volvo FH 500 Globetrotter XL',
    lastMessage: 'The asking price is EUR 125,000. We could offer a small discount for a quick sale.',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
  },
  {
    id: '3',
    participant: { name: 'FleetPro NV', avatar: '' },
    listingTitle: 'Scania R 450 Highline',
    lastMessage: 'We can arrange international delivery. Please contact us for a quote.',
    lastMessageTime: '3 days ago',
    unreadCount: 0,
  },
];

const dummyMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: 'me', body: 'Hello, I saw your Mercedes-Benz Actros 2545 listing. Is it still available?', createdAt: '2024-01-18T10:00:00Z' },
    { id: 'm2', senderId: 'other', body: 'Yes, the truck is still available. Would you like to schedule a viewing?', createdAt: '2024-01-18T10:15:00Z' },
    { id: 'm3', senderId: 'me', body: 'That would be great. Are you available this Friday afternoon?', createdAt: '2024-01-18T10:30:00Z' },
    { id: 'm4', senderId: 'other', body: 'Friday afternoon works perfectly. How about 2:00 PM at our yard in Rotterdam?', createdAt: '2024-01-18T11:00:00Z' },
    { id: 'm5', senderId: 'me', body: 'Perfect, I will be there. Can you also prepare the full service history?', createdAt: '2024-01-18T11:20:00Z' },
    { id: 'm6', senderId: 'other', body: 'Absolutely! I will have the complete documentation ready for you. See you Friday!', createdAt: '2024-01-18T14:00:00Z' },
  ],
  '2': [
    { id: 'm10', senderId: 'me', body: 'Hi, I am interested in the Volvo FH 500. What is the best price you can offer?', createdAt: '2024-01-17T08:00:00Z' },
    { id: 'm11', senderId: 'other', body: 'Hello! The asking price is EUR 125,000. For a quick sale, we could discuss a small discount.', createdAt: '2024-01-17T09:00:00Z' },
    { id: 'm12', senderId: 'me', body: 'Thank you. I will think about it and get back to you.', createdAt: '2024-01-17T12:00:00Z' },
  ],
};

export default function MessagesPage() {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = dummyThreads.find((t) => t.id === activeThreadId);
  const messages = activeThreadId ? dummyMessages[activeThreadId] || [] : [];

  const filteredThreads = dummyThreads.filter(
    (t) =>
      t.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeThreadId]);

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setMobileView('conversation');
  };

  const handleSend = () => {
    if (!messageInput.trim() || !activeThreadId) return;
    setMessageInput('');
  };

  const handleBackToList = () => {
    setMobileView('list');
    setActiveThreadId(null);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Messages</h1>

        <div className="flex bg-white rounded-xl border border-border overflow-hidden" style={{ height: 'calc(100vh - 12rem)' }}>
          {/* Thread List */}
          <div
            className={cn(
              'w-full md:w-80 lg:w-96 border-r border-border flex flex-col shrink-0',
              mobileView === 'conversation' ? 'hidden md:flex' : 'flex'
            )}
          >
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

            <div className="flex-1 overflow-y-auto">
              {filteredThreads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/50 mb-3" />
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
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-accent">
                        {thread.participant.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground truncate">
                          {thread.participant.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {thread.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-primary truncate font-medium">{thread.listingTitle}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage}</p>
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
                <div className="flex items-center gap-3 p-4 border-b border-border shrink-0">
                  <button
                    onClick={handleBackToList}
                    className="p-1 rounded-lg hover:bg-muted transition-colors md:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent">
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

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.senderId === 'me';
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
                  })}
                  <div ref={messagesEndRef} />
                </div>

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
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium">Select a conversation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a thread from the left to view messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
