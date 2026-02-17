'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  Minus,
  X,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMessagesStore } from '@/store/messages';
import { useAuthStore } from '@/store/auth';

interface ChatWidgetProps {
  threadId: string;
  listingTitle: string;
  sellerName: string;
  onClose: () => void;
}

export function ChatWidget({ threadId, listingTitle, sellerName, onClose }: ChatWidgetProps) {
  const { user } = useAuthStore();
  const { messages, isLoading, isSending, fetchMessages, sendMessage } = useMessagesStore();

  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [sendError, setSendError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages on mount + poll every 10s
  useEffect(() => {
    fetchMessages(threadId);
    const interval = setInterval(() => fetchMessages(threadId), 10000);
    return () => clearInterval(interval);
  }, [threadId, fetchMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, minimized]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    setSendError('');
    const body = input;
    setInput('');
    try {
      await sendMessage(threadId, body);
    } catch {
      setSendError('Failed to send. Try again.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col shadow-2xl rounded-xl border border-border bg-white overflow-hidden"
      style={{ width: 380, maxHeight: minimized ? 'auto' : 450 }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-primary text-white cursor-pointer select-none shrink-0"
        onClick={() => setMinimized((m) => !m)}
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold">{sellerName.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{sellerName}</p>
          <p className="text-[10px] text-white/70 truncate">{listingTitle}</p>
        </div>
        <Link
          href="/messages"
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          title="View all messages"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>
        <button
          onClick={(e) => { e.stopPropagation(); setMinimized((m) => !m); }}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          title={minimized ? 'Expand' : 'Minimize'}
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body — hidden when minimized */}
      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: 200, maxHeight: 320 }}>
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                No messages yet
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
                        'max-w-[75%] rounded-2xl px-3 py-2',
                        isMine
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      )}
                    >
                      <p className="text-sm">{msg.body}</p>
                      <p
                        className={cn(
                          'text-[10px] mt-0.5',
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

          {/* Error */}
          {sendError && (
            <div className="px-3 pb-1">
              <p className="text-xs text-red-500">{sendError}</p>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 p-2 border-t border-border shrink-0"
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-9 px-3 rounded-full border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              variant="accent"
              size="icon"
              className="rounded-full shrink-0 h-9 w-9"
              disabled={!input.trim() || isSending}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
