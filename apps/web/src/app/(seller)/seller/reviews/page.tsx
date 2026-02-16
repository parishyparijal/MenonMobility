'use client';

import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  buyer: { name: string; avatar: string };
  rating: number;
  title: string;
  body: string;
  listingTitle: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
  sellerResponse: string | null;
  respondedAt: string | null;
}

const dummyReviews: Review[] = [
  {
    id: '1',
    buyer: { name: 'Klaus Mueller', avatar: '' },
    rating: 5,
    title: 'Excellent experience!',
    body: 'Very professional dealer. The truck was exactly as described and in perfect condition. Smooth transaction from start to finish. Highly recommended!',
    listingTitle: 'Mercedes-Benz Actros 2545',
    createdAt: '2024-01-15',
    isVerifiedPurchase: true,
    sellerResponse: 'Thank you Klaus! It was a pleasure doing business with you. Enjoy your new Actros!',
    respondedAt: '2024-01-16',
  },
  {
    id: '2',
    buyer: { name: 'Pierre Dupont', avatar: '' },
    rating: 4,
    title: 'Good overall, minor delay',
    body: 'The Volvo FH was in great condition. There was a small delay in paperwork processing but the team handled it well. Would buy from them again.',
    listingTitle: 'Volvo FH 500 Globetrotter',
    createdAt: '2024-01-10',
    isVerifiedPurchase: true,
    sellerResponse: null,
    respondedAt: null,
  },
  {
    id: '3',
    buyer: { name: 'Anna Kowalski', avatar: '' },
    rating: 5,
    title: 'Top-notch service',
    body: 'Fast response time, honest description of the vehicle, and they even arranged delivery to Poland. Very satisfied with the purchase.',
    listingTitle: 'DAF XF 480 Space Cab',
    createdAt: '2024-01-05',
    isVerifiedPurchase: false,
    sellerResponse: 'Thank you for your kind words, Anna! We are glad you are happy with your DAF.',
    respondedAt: '2024-01-06',
  },
  {
    id: '4',
    buyer: { name: 'Marco Rossi', avatar: '' },
    rating: 3,
    title: 'Decent but could be better',
    body: 'Vehicle was okay but had some wear not mentioned in the listing. Communication could have been more transparent. Fair price though.',
    listingTitle: 'Scania R 450 Highline',
    createdAt: '2023-12-28',
    isVerifiedPurchase: true,
    sellerResponse: null,
    respondedAt: null,
  },
  {
    id: '5',
    buyer: { name: 'Johan Svensson', avatar: '' },
    rating: 5,
    title: 'Best dealer worldwide!',
    body: 'Have bought 3 trucks from them now. Always reliable, always fair. They go above and beyond to make sure everything is perfect.',
    listingTitle: 'MAN TGX 18.510',
    createdAt: '2023-12-20',
    isVerifiedPurchase: true,
    sellerResponse: 'Johan, you are one of our best customers! Looking forward to helping you with your next truck.',
    respondedAt: '2023-12-21',
  },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating ? 'fill-accent text-accent' : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  );
}

export default function SellerReviewsPage() {
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const avgRating = (dummyReviews.reduce((sum, r) => sum + r.rating, 0) / dummyReviews.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => dummyReviews.filter((r) => r.rating === star).length
  );

  const handleSubmitResponse = (reviewId: string) => {
    // In real app, call API
    setRespondingTo(null);
    setResponseText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="text-muted-foreground mt-1">See what buyers say about you</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-foreground">{avgRating}</p>
            <StarRating rating={Math.round(Number(avgRating))} size="lg" />
            <p className="text-sm text-muted-foreground mt-2">
              Based on {dummyReviews.length} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star, idx) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-3">{star}</span>
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{
                        width: `${dummyReviews.length ? (ratingCounts[idx] / dummyReviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-4 text-right">
                    {ratingCounts[idx]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Response Rate</span>
              </div>
              <span className="text-sm font-semibold text-foreground">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Positive Reviews</span>
              </div>
              <span className="text-sm font-semibold text-foreground">80%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Responded</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {dummyReviews.filter((r) => r.sellerResponse).length}/{dummyReviews.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {dummyReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {review.buyer.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {review.buyer.name}
                        </span>
                        {review.isVerifiedPurchase && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Re: {review.listingTitle} &middot;{' '}
                        {new Date(review.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-semibold text-foreground mt-3">{review.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{review.body}</p>

                  {/* Seller Response */}
                  {review.sellerResponse && (
                    <div className="mt-3 bg-primary-50 rounded-lg p-3 border-l-3 border-primary">
                      <p className="text-xs font-semibold text-primary mb-1">Your Response</p>
                      <p className="text-sm text-foreground">{review.sellerResponse}</p>
                      {review.respondedAt && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Responded{' '}
                          {new Date(review.respondedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Respond Form */}
                  {!review.sellerResponse && respondingTo !== review.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setRespondingTo(review.id)}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      Respond
                    </Button>
                  )}

                  {respondingTo === review.id && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        id={`response-${review.id}`}
                        placeholder="Write your response..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => handleSubmitResponse(review.id)}
                          disabled={!responseText.trim()}
                        >
                          Submit Response
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseText('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
