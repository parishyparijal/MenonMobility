'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Save,
  X,
  ExternalLink,
  GripVertical,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CmsPage {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

const dummyPages: CmsPage[] = [
  { id: '1', title: 'About Us', slug: 'about', isPublished: true, sortOrder: 1, updatedAt: '2024-01-15' },
  { id: '2', title: 'Terms of Service', slug: 'terms', isPublished: true, sortOrder: 2, updatedAt: '2024-01-10' },
  { id: '3', title: 'Privacy Policy', slug: 'privacy', isPublished: true, sortOrder: 3, updatedAt: '2024-01-10' },
  { id: '4', title: 'Cookie Policy', slug: 'cookies', isPublished: true, sortOrder: 4, updatedAt: '2024-01-10' },
  { id: '5', title: 'How It Works', slug: 'how-it-works', isPublished: true, sortOrder: 5, updatedAt: '2024-01-12' },
  { id: '6', title: 'FAQ', slug: 'faq', isPublished: true, sortOrder: 6, updatedAt: '2024-01-14' },
  { id: '7', title: 'Sell Your Vehicle', slug: 'sell', isPublished: true, sortOrder: 7, updatedAt: '2024-01-13' },
  { id: '8', title: 'Advertise With Us', slug: 'advertise', isPublished: false, sortOrder: 8, updatedAt: '2024-01-08' },
  { id: '9', title: 'Press & Media', slug: 'press', isPublished: false, sortOrder: 9, updatedAt: '2024-01-05' },
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState(dummyPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePublish = (id: string) => {
    setPages(pages.map((p) => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
  };

  const handleDelete = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
  };

  const startEdit = (page: CmsPage) => {
    setEditingId(page.id);
    setEditTitle(page.title);
    setEditSlug(page.slug);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setPages(pages.map((p) => p.id === editingId ? { ...p, title: editTitle, slug: editSlug } : p));
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const slug = newSlug || newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setPages([...pages, {
      id: `new-${Date.now()}`,
      title: newTitle,
      slug,
      isPublished: false,
      sortOrder: pages.length + 1,
      updatedAt: new Date().toISOString().split('T')[0],
    }]);
    setNewTitle('');
    setNewSlug('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CMS Pages</h1>
          <p className="text-muted-foreground mt-1">
            {pages.length} pages &middot; {pages.filter((p) => p.isPublished).length} published
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-5">
            <h3 className="text-sm font-semibold mb-3">Create New Page</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Page title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Slug (auto-generated)"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 mt-3">
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
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Card>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-8"></th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Page</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Slug</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => (
                  <tr key={page.id} className="border-b border-border last:border-0 hover:bg-muted/30 group">
                    <td className="py-3 px-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="py-3 px-4">
                      {editingId === page.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-7 px-2 rounded border border-primary text-sm focus:outline-none w-full"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{page.title}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === page.id ? (
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="h-7 px-2 rounded border border-primary text-sm focus:outline-none w-full"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono">/{page.slug}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={page.isPublished ? 'bg-success/10 text-success border-0' : 'bg-muted text-muted-foreground border-0'}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-muted-foreground">{page.updatedAt}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editingId === page.id ? (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveEdit}>
                              <Save className="w-3 h-3 text-success" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(null)}>
                              <X className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePublish(page.id)}>
                              {page.isPublished ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(page)}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(page.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
