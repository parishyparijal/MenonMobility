'use client';

import { useState } from 'react';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  GripVertical,
  Search,
  Image as ImageIcon,
  Save,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  listingCount: number;
  isActive: boolean;
  children: Category[];
}

const dummyCategories: Category[] = [
  {
    id: '1',
    name: 'Trucks',
    slug: 'trucks',
    icon: 'Truck',
    listingCount: 2456,
    isActive: true,
    children: [
      { id: '1a', name: 'Tractor Units', slug: 'tractor-units', icon: '', listingCount: 856, isActive: true, children: [] },
      { id: '1b', name: 'Rigid Trucks', slug: 'rigid-trucks', icon: '', listingCount: 623, isActive: true, children: [] },
      { id: '1c', name: 'Box Trucks', slug: 'box-trucks', icon: '', listingCount: 412, isActive: true, children: [] },
      { id: '1d', name: 'Flatbed Trucks', slug: 'flatbed-trucks', icon: '', listingCount: 298, isActive: true, children: [] },
      { id: '1e', name: 'Tipper Trucks', slug: 'tipper-trucks', icon: '', listingCount: 267, isActive: true, children: [] },
    ],
  },
  {
    id: '2',
    name: 'Trailers',
    slug: 'trailers',
    icon: 'Container',
    listingCount: 1120,
    isActive: true,
    children: [
      { id: '2a', name: 'Curtainsiders', slug: 'curtainsiders', icon: '', listingCount: 345, isActive: true, children: [] },
      { id: '2b', name: 'Flatbed Trailers', slug: 'flatbed-trailers', icon: '', listingCount: 278, isActive: true, children: [] },
      { id: '2c', name: 'Refrigerated', slug: 'refrigerated', icon: '', listingCount: 210, isActive: true, children: [] },
      { id: '2d', name: 'Tanker Trailers', slug: 'tanker-trailers', icon: '', listingCount: 156, isActive: true, children: [] },
    ],
  },
  {
    id: '3',
    name: 'Construction',
    slug: 'construction',
    icon: 'HardHat',
    listingCount: 890,
    isActive: true,
    children: [
      { id: '3a', name: 'Excavators', slug: 'excavators', icon: '', listingCount: 312, isActive: true, children: [] },
      { id: '3b', name: 'Wheel Loaders', slug: 'wheel-loaders', icon: '', listingCount: 198, isActive: true, children: [] },
      { id: '3c', name: 'Bulldozers', slug: 'bulldozers', icon: '', listingCount: 156, isActive: true, children: [] },
      { id: '3d', name: 'Cranes', slug: 'cranes', icon: '', listingCount: 124, isActive: true, children: [] },
    ],
  },
  {
    id: '4',
    name: 'Vans',
    slug: 'vans',
    icon: 'Bus',
    listingCount: 654,
    isActive: true,
    children: [
      { id: '4a', name: 'Panel Vans', slug: 'panel-vans', icon: '', listingCount: 287, isActive: true, children: [] },
      { id: '4b', name: 'Sprinter Vans', slug: 'sprinter-vans', icon: '', listingCount: 198, isActive: true, children: [] },
      { id: '4c', name: 'Pickup Trucks', slug: 'pickup-trucks', icon: '', listingCount: 169, isActive: true, children: [] },
    ],
  },
  {
    id: '5',
    name: 'Cars',
    slug: 'cars',
    icon: 'Car',
    listingCount: 320,
    isActive: true,
    children: [],
  },
  {
    id: '6',
    name: 'Containers',
    slug: 'containers',
    icon: 'Package',
    listingCount: 210,
    isActive: true,
    children: [],
  },
  {
    id: '7',
    name: 'Parts & Accessories',
    slug: 'parts',
    icon: 'Wrench',
    listingCount: 567,
    isActive: true,
    children: [],
  },
  {
    id: '8',
    name: 'Agricultural',
    slug: 'agricultural',
    icon: 'Tractor',
    listingCount: 0,
    isActive: false,
    children: [],
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(dummyCategories);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatParent, setNewCatParent] = useState('');

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedIds(next);
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = (id: string) => {
    setCategories(categories.map((c) => {
      if (c.id === id) return { ...c, name: editName };
      return { ...c, children: c.children.map((ch) => ch.id === id ? { ...ch, name: editName } : ch) };
    }));
    setEditingId(null);
  };

  const toggleActive = (id: string) => {
    setCategories(categories.map((c) => {
      if (c.id === id) return { ...c, isActive: !c.isActive };
      return { ...c, children: c.children.map((ch) => ch.id === id ? { ...ch, isActive: !ch.isActive } : ch) };
    }));
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const slug = newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCat: Category = {
      id: `new-${Date.now()}`,
      name: newCatName,
      slug,
      icon: '',
      listingCount: 0,
      isActive: true,
      children: [],
    };
    if (newCatParent) {
      setCategories(categories.map((c) =>
        c.id === newCatParent ? { ...c, children: [...c.children, newCat] } : c
      ));
    } else {
      setCategories([...categories, newCat]);
    }
    setNewCatName('');
    setNewCatSlug('');
    setNewCatParent('');
    setShowAddForm(false);
  };

  const totalListings = categories.reduce((sum, c) => sum + c.listingCount, 0);

  const filteredCategories = searchQuery
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.children.some((ch) => ch.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">
            {categories.length} categories &middot; {totalListings.toLocaleString()} total listings
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-5">
            <h3 className="text-sm font-semibold mb-3">New Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Category name"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Slug (auto-generated)"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={newCatParent}
                onChange={(e) => setNewCatParent(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Top-level category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="accent" size="sm" onClick={handleAddCategory}>
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
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Card>
        <CardContent className="pt-5 divide-y divide-border">
          {filteredCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 py-3 group">
                <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                {cat.children.length > 0 ? (
                  <button onClick={() => toggleExpand(cat.id)} className="p-0.5">
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedIds.has(cat.id) ? 'rotate-90' : ''}`} />
                  </button>
                ) : (
                  <div className="w-5" />
                )}
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderTree className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-7 px-2 rounded border border-primary text-sm focus:outline-none"
                        autoFocus
                      />
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => saveEdit(cat.id)}>
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setEditingId(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                      <span className="text-xs text-muted-foreground">/{cat.slug}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{cat.listingCount.toLocaleString()} listings</span>
                <Badge className={cat.isActive ? 'bg-success/10 text-success border-0' : 'bg-muted text-muted-foreground border-0'}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {cat.children.length > 0 && (
                  <Badge variant="outline" className="text-xs">{cat.children.length} sub</Badge>
                )}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(cat.id, cat.name)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleActive(cat.id)}>
                    {cat.isActive ? <X className="w-3 h-3 text-destructive" /> : <Save className="w-3 h-3 text-success" />}
                  </Button>
                </div>
              </div>
              {expandedIds.has(cat.id) && cat.children.length > 0 && (
                <div className="ml-12 border-l border-border">
                  {cat.children.map((child) => (
                    <div key={child.id} className="flex items-center gap-3 py-2 pl-4 group">
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingId === child.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-7 px-2 rounded border border-primary text-sm focus:outline-none"
                              autoFocus
                            />
                            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => saveEdit(child.id)}>
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setEditingId(null)}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground">{child.name}</span>
                            <span className="text-xs text-muted-foreground">/{child.slug}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{child.listingCount.toLocaleString()}</span>
                      <Badge className={child.isActive ? 'bg-success/10 text-success border-0 text-[10px]' : 'bg-muted text-muted-foreground border-0 text-[10px]'}>
                        {child.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEdit(child.id, child.name)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleActive(child.id)}>
                          {child.isActive ? <X className="w-3 h-3 text-destructive" /> : <Save className="w-3 h-3 text-success" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
