'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Truck,
  MessageSquare,
  Heart,
  Star,
  AlertCircle,
  CreditCard,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'listing' | 'message' | 'favorite' | 'review' | 'system' | 'payment';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

const dummyNotifications: Notification[] = [
  {
    id: '1', type: 'message', title: 'New message from TransEuropa BV',
    body: 'Regarding: Mercedes-Benz Actros 2545 LS - "Yes, the truck is still available..."',
    isRead: false, createdAt: '2 hours ago',
  },
  {
    id: '2', type: 'favorite', title: 'Price drop on a saved listing',
    body: 'Volvo FH 500 Globetrotter XL has dropped from EUR 130,000 to EUR 125,000',
    isRead: false, createdAt: '5 hours ago',
  },
  {
    id: '3', type: 'listing', title: 'New matching listing',
    body: 'A new Scania R 450 matching your saved search "Scania under 100k" has been listed',
    isRead: false, createdAt: '1 day ago',
  },
  {
    id: '4', type: 'review', title: 'New review on your profile',
    body: 'Jan de Vries left a 5-star review: "Excellent truck, great seller"',
    isRead: true, createdAt: '2 days ago',
  },
  {
    id: '5', type: 'system', title: 'Welcome to Menon Mobility!',
    body: 'Your account has been verified. Start browsing thousands of commercial vehicles.',
    isRead: true, createdAt: '3 days ago',
  },
  {
    id: '6', type: 'payment', title: 'Subscription renewed',
    body: 'Your Pro plan has been renewed for EUR 79.00. Next billing date: Feb 1, 2024.',
    isRead: true, createdAt: '5 days ago',
  },
  {
    id: '7', type: 'listing', title: 'Listing approved',
    body: 'Your listing "DAF XF 480 FT Space Cab" has been approved and is now live.',
    isRead: true, createdAt: '1 week ago',
  },
  {
    id: '8', type: 'message', title: 'New message from Nordic Trucks GmbH',
    body: 'Regarding: Volvo FH 500 - "The asking price is EUR 125,000..."',
    isRead: true, createdAt: '1 week ago',
  },
];

const typeIcons: Record<string, React.ElementType> = {
  listing: Truck,
  message: MessageSquare,
  favorite: Heart,
  review: Star,
  system: AlertCircle,
  payment: CreditCard,
};

const typeColors: Record<string, string> = {
  listing: 'bg-primary/10 text-primary',
  message: 'bg-accent/10 text-accent',
  favorite: 'bg-pink-100 text-pink-600',
  review: 'bg-yellow-100 text-yellow-600',
  system: 'bg-primary-100 text-primary',
  payment: 'bg-green-100 text-green-600',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground text-sm">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-1" /> Mark all as read
            </Button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              filter === 'all' ? 'bg-primary text-white' : 'bg-white text-muted-foreground border border-border'
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              filter === 'unread' ? 'bg-primary text-white' : 'bg-white text-muted-foreground border border-border'
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            const colorClass = typeColors[notification.type] || 'bg-muted text-muted-foreground';
            return (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-xl bg-white border transition-colors group',
                  notification.isRead ? 'border-border' : 'border-primary/20 bg-primary/[0.02]'
                )}
              >
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', colorClass)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn('text-sm font-medium', notification.isRead ? 'text-foreground' : 'text-foreground')}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.body}</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block">{notification.createdAt}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {!notification.isRead && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markAsRead(notification.id)}>
                      <Check className="w-3 h-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(notification.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-16">
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
