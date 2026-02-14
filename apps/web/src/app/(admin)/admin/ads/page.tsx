'use client';

import { useState } from 'react';
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  MousePointerClick,
  Calendar,
  Search,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BannerAd {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: 'HOMEPAGE' | 'CATEGORY' | 'SEARCH' | 'SIDEBAR';
  impressions: number;
  clicks: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

const dummyAds: BannerAd[] = [
  {
    id: '1', title: 'Mercedes-Benz New Actros Launch', imageUrl: '', targetUrl: 'https://mercedes-benz-trucks.com',
    placement: 'HOMEPAGE', impressions: 45230, clicks: 1234, startsAt: '2024-01-01', endsAt: '2024-03-31', isActive: true,
  },
  {
    id: '2', title: 'Volvo Trucks Spring Sale', imageUrl: '', targetUrl: 'https://volvotrucks.com',
    placement: 'SEARCH', impressions: 32100, clicks: 890, startsAt: '2024-02-01', endsAt: '2024-04-30', isActive: true,
  },
  {
    id: '3', title: 'TruckFinance.eu - Low Rates', imageUrl: '', targetUrl: 'https://truckfinance.eu',
    placement: 'SIDEBAR', impressions: 18500, clicks: 456, startsAt: '2024-01-15', endsAt: '2024-06-30', isActive: true,
  },
  {
    id: '4', title: 'CAT Equipment Clearance', imageUrl: '', targetUrl: 'https://cat.com',
    placement: 'CATEGORY', impressions: 12800, clicks: 312, startsAt: '2024-01-10', endsAt: '2024-02-28', isActive: true,
  },
  {
    id: '5', title: 'Shell Fleet Card - Sign Up', imageUrl: '', targetUrl: 'https://shell.com/fleet',
    placement: 'HOMEPAGE', impressions: 8900, clicks: 178, startsAt: '2023-12-01', endsAt: '2024-01-31', isActive: false,
  },
  {
    id: '6', title: 'TruckParts24.de Summer Deals', imageUrl: '', targetUrl: 'https://truckparts24.de',
    placement: 'SIDEBAR', impressions: 5600, clicks: 98, startsAt: '2024-03-01', endsAt: '2024-08-31', isActive: false,
  },
];

const placementColors: Record<string, string> = {
  HOMEPAGE: 'bg-primary/10 text-primary',
  CATEGORY: 'bg-accent/10 text-accent',
  SEARCH: 'bg-green-100 text-green-700',
  SIDEBAR: 'bg-purple-100 text-purple-700',
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState(dummyAds);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAds = ads.filter((ad) =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setAds(ads.map((ad) => ad.id === id ? { ...ad, isActive: !ad.isActive } : ad));
  };

  const handleDelete = (id: string) => {
    setAds(ads.filter((ad) => ad.id !== id));
  };

  const totalImpressions = ads.reduce((s, ad) => s + ad.impressions, 0);
  const totalClicks = ads.reduce((s, ad) => s + ad.clicks, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banner Ads</h1>
          <p className="text-muted-foreground mt-1">
            {ads.length} ads &middot; {ads.filter((a) => a.isActive).length} active
          </p>
        </div>
        <Button variant="accent">
          <Plus className="w-4 h-4 mr-2" />
          Create Ad
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Impressions</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totalImpressions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <MousePointerClick className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Total Clicks</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Megaphone className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Avg CTR</span>
            </div>
            <p className="text-xl font-bold text-foreground">{avgCtr}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Active Ads</span>
            </div>
            <p className="text-xl font-bold text-foreground">{ads.filter((a) => a.isActive).length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search ads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Ads Table */}
      <Card>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Ad</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Placement</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Impressions</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Clicks</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">CTR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Period</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((ad) => {
                  const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0';
                  return (
                    <tr key={ad.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Megaphone className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{ad.title}</p>
                            <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary flex items-center gap-0.5 hover:underline">
                              {ad.targetUrl.replace('https://', '')} <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${placementColors[ad.placement]} border-0 text-[10px]`}>
                          {ad.placement}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{ad.impressions.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-medium">{ad.clicks.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-medium">{ctr}%</td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-muted-foreground">{ad.startsAt} — {ad.endsAt}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button onClick={() => toggleActive(ad.id)} className="inline-flex">
                          {ad.isActive ? (
                            <ToggleRight className="w-6 h-6 text-success" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(ad.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
