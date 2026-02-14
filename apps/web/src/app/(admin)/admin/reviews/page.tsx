'use client';

import { useState } from 'react';
import {
  Star,
  Flag,
  Trash2,
  Search,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  buyerName: string;
  sellerName: string;
  listingTitle: string;
  rating: number;
  title: string;
  body: string;
  sellerResponse: string | null;
  isFlagged: boolean;
  createdAt: string;
}

const dummyReviews: Review[] = [
  {
    id: '1', buyerName: 'Jan de Vries', sellerName: 'TransEuropa BV', listingTitle: 'Mercedes-Benz Actros 2545 LS',
    rating: 5, title: 'Excellent truck, great seller', body: 'The truck was exactly as described. TransEuropa was professional throughout the entire process. Delivery was on time and documentation was perfect.',
    sellerResponse: 'Thank you for your kind review, Jan! We are glad you are happy with the Actros. Please do not hesitate to contact us for any future needs.', isFlagged: false, createdAt: '2024-01-18',
  },
  {
    id: '2', buyerName: 'Klaus Müller', sellerName: 'Nordic Trucks GmbH', listingTitle: 'Volvo FH 500 Globetrotter',
    rating: 1, title: 'Truck had undisclosed issues', body: 'After purchase, I discovered significant engine problems that were not mentioned in the listing. Very disappointed with the lack of transparency.',
    sellerResponse: null, isFlagged: true, createdAt: '2024-01-17',
  },
  {
    id: '3', buyerName: 'Pierre Dupont', sellerName: 'FleetPro NV', listingTitle: 'Scania R 450 Highline',
    rating: 4, title: 'Good truck, minor delay', body: 'The Scania is in great condition. Only issue was a 5-day delay in delivery, but the seller communicated well about the delay.',
    sellerResponse: 'Thank you Pierre. We apologize for the delivery delay - it was due to an unexpected logistical issue. Glad you are satisfied with the truck!', isFlagged: false, createdAt: '2024-01-16',
  },
  {
    id: '4', buyerName: 'Anonymous', sellerName: 'EuroTruck GmbH', listingTitle: 'DAF XF 480 FT Space Cab',
    rating: 2, title: 'Misleading photos', body: 'The photos showed a much better condition than reality. Several scratches and dents not visible in the listing images. Price was too high for the actual condition.',
    sellerResponse: null, isFlagged: true, createdAt: '2024-01-15',
  },
  {
    id: '5', buyerName: 'Henrik Svensson', sellerName: 'BavariaTruck AG', listingTitle: 'Caterpillar 320 GC Excavator',
    rating: 5, title: 'Perfect condition machine', body: 'The excavator was in perfect working condition. BavariaTruck provided all service records and were very helpful with the export documentation.',
    sellerResponse: null, isFlagged: false, createdAt: '2024-01-14',
  },
  {
    id: '6', buyerName: 'Tomasz Kowalski', sellerName: 'DutchFleet BV', listingTitle: 'MAN TGX 18.510',
    rating: 3, title: 'Average experience', body: 'Truck is okay but the seller was slow to respond to messages. It took over a week to get basic questions answered.',
    sellerResponse: 'We apologize for the slow response time, Tomasz. We were understaffed during that period. We have since improved our response process.', isFlagged: false, createdAt: '2024-01-12',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(dummyReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'flagged'>('all');

  const flaggedCount = reviews.filter((r) => r.isFlagged).length;

  const filteredReviews = reviews
    .filter((r) => {
      if (filterTab === 'flagged') return r.isFlagged;
      return true;
    })
    .filter((r) =>
      searchQuery
        ? r.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const toggleFlag = (id: string) => {
    setReviews(reviews.map((r) => r.id === id ? { ...r, isFlagged: !r.isFlagged } : r));
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Review Moderation</h1>
        <p className="text-muted-foreground mt-1">
          {reviews.length} reviews &middot; Avg {avgRating} stars
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{avgRating}</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-destructive">{flaggedCount}</p>
            <p className="text-xs text-muted-foreground">Flagged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-success">{reviews.filter((r) => r.sellerResponse).length}</p>
            <p className="text-xs text-muted-foreground">Responded</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterTab === 'all' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilterTab('flagged')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterTab === 'flagged' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Flagged ({flaggedCount})
          </button>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.map((review) => (
          <Card key={review.id} className={review.isFlagged ? 'border-destructive/30 bg-destructive/5' : ''}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">{review.buyerName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-foreground">{review.buyerName}</span>
                    <span className="text-xs text-muted-foreground">&rarr;</span>
                    <span className="text-sm text-primary font-medium">{review.sellerName}</span>
                    {review.isFlagged && (
                      <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]">
                        <AlertTriangle className="w-3 h-3 mr-0.5" /> Flagged
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Re: {review.listingTitle} &middot; {review.createdAt}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.rating} />
                    <span className="text-sm font-medium text-foreground">{review.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.body}</p>
                  {review.sellerResponse && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-2 border-primary">
                      <p className="text-xs font-medium text-primary mb-1">Seller Response</p>
                      <p className="text-sm text-muted-foreground">{review.sellerResponse}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${review.isFlagged ? 'text-destructive' : 'text-muted-foreground'}`}
                    onClick={() => toggleFlag(review.id)}
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}
