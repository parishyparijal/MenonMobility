'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ChatWidget } from '@/components/chat/chat-widget';
import { useMessagesStore } from '@/store/messages';
import { useAuthStore } from '@/store/auth';

const POLL_INTERVAL = 15000; // 15 seconds

/**
 * ChatNotifier — polls for new unread messages for any logged-in user.
 * When unreadCount increases, auto-opens ChatWidget for the newest unread thread.
 * Works in both seller layout (/seller/*) and main layout (anywhere).
 */
export function ChatNotifier() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { unreadCount, fetchUnreadCount, threads, fetchThreads } = useMessagesStore();

  const lastKnownUnread = useRef(unreadCount);
  const [openThread, setOpenThread] = useState<{
    id: string;
    participantName: string;
    listingTitle: string;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Don't show widget if user is already on any messages page
  const isOnMessagesPage =
    pathname?.startsWith('/seller/messages') || pathname?.startsWith('/messages');

  // Determine correct messages href based on current context
  const messagesHref = pathname?.startsWith('/seller') ? '/seller/messages' : '/messages';

  // Poll unread count every 15s (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  // When unread count increases, fetch threads to find the newest one
  useEffect(() => {
    if (unreadCount > lastKnownUnread.current && !isOnMessagesPage) {
      fetchThreads();
    }
    lastKnownUnread.current = unreadCount;
  }, [unreadCount, isOnMessagesPage, fetchThreads]);

  // When threads update and there are unread, find the newest unread thread
  const findNewestUnread = useCallback(() => {
    if (isOnMessagesPage || dismissed) return;
    const unreadThread = threads.find((t) => t.unreadCount > 0);
    if (unreadThread && (!openThread || openThread.id !== unreadThread.id)) {
      setOpenThread({
        id: unreadThread.id,
        participantName: unreadThread.participant.name,
        listingTitle: unreadThread.listingTitle,
      });
      setDismissed(false);
    }
  }, [threads, isOnMessagesPage, dismissed, openThread]);

  useEffect(() => {
    findNewestUnread();
  }, [findNewestUnread]);

  // Reset dismissed state when navigating away from messages page
  useEffect(() => {
    if (!isOnMessagesPage) return;
    setOpenThread(null);
    setDismissed(false);
  }, [isOnMessagesPage]);

  if (!isAuthenticated || !openThread || isOnMessagesPage) return null;

  return (
    <ChatWidget
      threadId={openThread.id}
      listingTitle={openThread.listingTitle}
      participantName={openThread.participantName}
      messagesHref={messagesHref}
      onClose={() => {
        setOpenThread(null);
        setDismissed(true);
      }}
    />
  );
}
