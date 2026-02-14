'use client';

import { useState } from 'react';
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  X,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BrandModel {
  id: string;
  name: string;
  slug: string;
  listingCount: number;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  listingCount: number;
  modelCount: number;
  isActive: boolean;
  models: BrandModel[];
}

const dummyBrands: Brand[] = [
  {
    id: '1', name: 'Mercedes-Benz', slug: 'mercedes-benz', logoUrl: '', listingCount: 856, modelCount: 12, isActive: true,
    models: [
      { id: 'm1', name: 'Actros', slug: 'actros', listingCount: 342 },
      { id: 'm2', name: 'Arocs', slug: 'arocs', listingCount: 178 },
      { id: 'm3', name: 'Atego', slug: 'atego', listingCount: 134 },
      { id: 'm4', name: 'Econic', slug: 'econic', listingCount: 89 },
      { id: 'm5', name: 'Unimog', slug: 'unimog', listingCount: 56 },
      { id: 'm6', name: 'Sprinter', slug: 'sprinter', listingCount: 57 },
    ],
  },
  {
    id: '2', name: 'Volvo', slug: 'volvo', logoUrl: '', listingCount: 723, modelCount: 8, isActive: true,
    models: [
      { id: 'm10', name: 'FH', slug: 'fh', listingCount: 289 },
      { id: 'm11', name: 'FM', slug: 'fm', listingCount: 198 },
      { id: 'm12', name: 'FMX', slug: 'fmx', listingCount: 112 },
      { id: 'm13', name: 'FE', slug: 'fe', listingCount: 78 },
      { id: 'm14', name: 'FL', slug: 'fl', listingCount: 46 },
    ],
  },
  {
    id: '3', name: 'Scania', slug: 'scania', logoUrl: '', listingCount: 645, modelCount: 6, isActive: true,
    models: [
      { id: 'm20', name: 'R Series', slug: 'r-series', listingCount: 245 },
      { id: 'm21', name: 'S Series', slug: 's-series', listingCount: 178 },
      { id: 'm22', name: 'G Series', slug: 'g-series', listingCount: 134 },
      { id: 'm23', name: 'P Series', slug: 'p-series', listingCount: 88 },
    ],
  },
  {
    id: '4', name: 'DAF', slug: 'daf', logoUrl: '', listingCount: 534, modelCount: 5, isActive: true,
    models: [
      { id: 'm30', name: 'XF', slug: 'xf', listingCount: 198 },
      { id: 'm31', name: 'XG', slug: 'xg', listingCount: 156 },
      { id: 'm32', name: 'CF', slug: 'cf', listingCount: 112 },
      { id: 'm33', name: 'LF', slug: 'lf', listingCount: 68 },
    ],
  },
  {
    id: '5', name: 'MAN', slug: 'man', logoUrl: '', listingCount: 489, modelCount: 4, isActive: true,
    models: [
      { id: 'm40', name: 'TGX', slug: 'tgx', listingCount: 198 },
      { id: 'm41', name: 'TGS', slug: 'tgs', listingCount: 156 },
      { id: 'm42', name: 'TGM', slug: 'tgm', listingCount: 89 },
      { id: 'm43', name: 'TGL', slug: 'tgl', listingCount: 46 },
    ],
  },
  {
    id: '6', name: 'Iveco', slug: 'iveco', logoUrl: '', listingCount: 312, modelCount: 4, isActive: true,
    models: [
      { id: 'm50', name: 'S-Way', slug: 's-way', listingCount: 112 },
      { id: 'm51', name: 'Eurocargo', slug: 'eurocargo', listingCount: 98 },
      { id: 'm52', name: 'Daily', slug: 'daily', listingCount: 67 },
      { id: 'm53', name: 'X-Way', slug: 'x-way', listingCount: 35 },
    ],
  },
  {
    id: '7', name: 'Renault', slug: 'renault', logoUrl: '', listingCount: 278, modelCount: 3, isActive: true,
    models: [
      { id: 'm60', name: 'T Range', slug: 't-range', listingCount: 134 },
      { id: 'm61', name: 'C Range', slug: 'c-range', listingCount: 89 },
      { id: 'm62', name: 'D Range', slug: 'd-range', listingCount: 55 },
    ],
  },
  {
    id: '8', name: 'Caterpillar', slug: 'caterpillar', logoUrl: '', listingCount: 234, modelCount: 6, isActive: true,
    models: [
      { id: 'm70', name: '320 GC', slug: '320-gc', listingCount: 67 },
      { id: 'm71', name: '336', slug: '336', listingCount: 56 },
      { id: 'm72', name: '950 GC', slug: '950-gc', listingCount: 45 },
    ],
  },
  { id: '9', name: 'Komatsu', slug: 'komatsu', logoUrl: '', listingCount: 156, modelCount: 4, isActive: true, models: [] },
  { id: '10', name: 'JCB', slug: 'jcb', logoUrl: '', listingCount: 89, modelCount: 3, isActive: true, models: [] },
  { id: '11', name: 'Liebherr', slug: 'liebherr', logoUrl: '', listingCount: 67, modelCount: 3, isActive: true, models: [] },
  { id: '12', name: 'Hitachi', slug: 'hitachi', logoUrl: '', listingCount: 0, modelCount: 0, isActive: false, models: [] },
];

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState(dummyBrands);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!newBrandName.trim()) return;
    const slug = newBrandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setBrands([...brands, {
      id: `new-${Date.now()}`, name: newBrandName, slug, logoUrl: '', listingCount: 0, modelCount: 0, isActive: true, models: [],
    }]);
    setNewBrandName('');
    setShowAddForm(false);
  };

  const toggleActive = (id: string) => {
    setBrands(brands.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const deleteBrand = (id: string) => {
    setBrands(brands.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brands</h1>
          <p className="text-muted-foreground mt-1">
            {brands.length} brands &middot; {brands.reduce((s, b) => s + b.modelCount, 0)} models
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Brand name"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="accent" size="sm" onClick={handleAdd}>
                <Save className="w-3.5 h-3.5 mr-1" /> Create
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="w-3.5 h-3.5 mr-1" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <Card key={brand.id} className="overflow-hidden">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tags className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{brand.name}</h3>
                    <p className="text-xs text-muted-foreground">/{brand.slug}</p>
                  </div>
                </div>
                <Badge className={brand.isActive ? 'bg-success/10 text-success border-0' : 'bg-muted text-muted-foreground border-0'}>
                  {brand.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span>{brand.listingCount.toLocaleString()} listings</span>
                <span>{brand.modelCount} models</span>
              </div>
              {brand.models.length > 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => setExpandedId(expandedId === brand.id ? null : brand.id)}
                    className="flex items-center gap-1 text-xs text-primary font-medium"
                  >
                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedId === brand.id ? 'rotate-180' : ''}`} />
                    {expandedId === brand.id ? 'Hide' : 'Show'} models
                  </button>
                  {expandedId === brand.id && (
                    <div className="mt-2 space-y-1">
                      {brand.models.map((model) => (
                        <div key={model.id} className="flex items-center justify-between py-1 px-2 rounded bg-muted/30 text-xs">
                          <span className="text-foreground">{model.name}</span>
                          <span className="text-muted-foreground">{model.listingCount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => toggleActive(brand.id)}>
                  {brand.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => deleteBrand(brand.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
