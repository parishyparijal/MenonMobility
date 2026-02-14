'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Search, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Thread {
  id: string;
  participant: {
    name: string;
    avatar: string;
  };
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
    participant: { name: 'Klaus Mueller', avatar: '' },
    listingTitle: 'Mercedes-Benz Actros 2545',
    lastMessage: 'Is this truck still available? I am interested in scheduling a viewing.',
    lastMessageTime: '2 hours ago',
    unreadCount: 2,
  },
  {
    id: '2',
    participant: { name: 'Pierre Dupont', avatar: '' },
    listingTitle: 'Volvo FH 500 Globetrotter',
    lastMessage: 'What is the best price you can offer for this vehicle?',
    lastMessageTime: '5 hours ago',
    unreadCount: 1,
  },
  {
    id: '3',
    participant: { name: 'Anna Kowalski', avatar: '' },
    listingTitle: 'DAF XF 480 Space Cab',
    lastMessage: 'Thank you for the information. I will get back to you next week.',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
  },
  {
    id: '4',
    participant: { name: 'Marco Rossi', avatar: '' },
    listingTitle: 'Scania R 450 Highline',
    lastMessage: 'Can you arrange delivery to Milan, Italy?',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
  },
  {
    id: '5',
    participant: { name: 'Johan Svensson', avatar: '' },
    listingTitle: 'MAN TGX 18.510',
    lastMessage: 'I would like to know the full service history.',
    lastMessageTime: '3 days ago',
    unreadCount: 0,
  },
];

const dummyMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: 'other', body: 'Hello, I saw your listing for the Mercedes-Benz Actros 2545. Is it still available?', createdAt: '2024-01-18T10:00:00Z' },
    { id: 'm2', senderId: 'me', body: 'Yes, the truck is still available. Would you like to schedule a viewing?', createdAt: '2024-01-18T10:15:00Z' },
    { id: 'm3', senderId: 'other', body: 'That would be great. Are you available this Friday?', createdAt: '2024-01-18T10:30:00Z' },
    { id: 'm4', senderId: 'me', body: 'Friday works for me. How about 10:00 AM at our location in Rotterdam?', createdAt: '2024-01-18T11:00:00Z' },
    { id: 'm5', senderId: 'other', body: 'Perfect, I will be there. Can you also prepare the service history for me to review?', createdAt: '2024-01-18T11:20:00Z' },
    { id: 'm6', senderId: 'other', body: 'Is this truck still available? I am interested in scheduling a viewing.', createdAt: '2024-01-18T14:00:00Z' },
  ],
  '2': [
    { id: 'm10', senderId: 'other', body: 'Hi, I am interested in the Volvo FH 500. What is the best price?', createdAt: '2024-01-18T08:00:00Z' },
    { id: 'm11', senderId: 'me', body: 'Hello! The asking price is EUR 125,000. For a quick sale, we could discuss a small discount.', createdAt: '2024-01-18T09:00:00Z' },
    { id: 'm12', senderId: 'other', body: 'What is the best price you can offer for this vehicle?', createdAt: '2024-01-18T12:00:00Z' },
  ],
};

export default function SellerMessagesPage() {
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
    // In real app, call API
    setMessageInput('');
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
            {filteredThreads.map((thread) => (
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
                      {thread.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-xs text-accent truncate">{thread.listingTitle}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage}</p>
                </div>
                {thread.unreadCount > 0 && (
                  <Badge className="bg-accent text-white border-0 text-[10px] h-5 min-w-[20px] justify-center shrink-0">
                    {thread.unreadCount}
                  </Badge>
                )}
              </button>
            ))}
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
