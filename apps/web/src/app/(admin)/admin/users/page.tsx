'use client';

import { useState } from 'react';
import {
  Search,
  Shield,
  ShieldOff,
  MoreVertical,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/common/pagination';
import { cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  avatar: string;
  listingsCount: number;
  status: 'active' | 'banned';
  joinedAt: string;
}

const roleColors: Record<string, string> = {
  BUYER: 'bg-blue-50 text-blue-700 border-blue-200',
  SELLER: 'bg-green-50 text-green-700 border-green-200',
  ADMIN: 'bg-red-50 text-red-700 border-red-200',
};

const dummyUsers: AdminUser[] = [
  { id: '1', name: 'Jan de Vries', email: 'jan@transeuropa.nl', role: 'SELLER', avatar: '', listingsCount: 24, status: 'active', joinedAt: '2023-06-15' },
  { id: '2', name: 'Klaus Mueller', email: 'klaus@nordic-trucks.de', role: 'SELLER', avatar: '', listingsCount: 45, status: 'active', joinedAt: '2023-03-20' },
  { id: '3', name: 'Pierre Dupont', email: 'pierre.dupont@gmail.com', role: 'BUYER', avatar: '', listingsCount: 0, status: 'active', joinedAt: '2024-01-05' },
  { id: '4', name: 'Anna Kowalski', email: 'anna@fleetpro.be', role: 'SELLER', avatar: '', listingsCount: 18, status: 'active', joinedAt: '2023-08-10' },
  { id: '5', name: 'Marco Rossi', email: 'marco.rossi@email.it', role: 'BUYER', avatar: '', listingsCount: 0, status: 'banned', joinedAt: '2023-11-22' },
  { id: '6', name: 'Sarah Johnson', email: 'sarah.j@menontrucks.com', role: 'ADMIN', avatar: '', listingsCount: 0, status: 'active', joinedAt: '2023-01-01' },
  { id: '7', name: 'Johan Svensson', email: 'johan@sventruck.se', role: 'SELLER', avatar: '', listingsCount: 12, status: 'active', joinedAt: '2023-09-18' },
  { id: '8', name: 'Elena Garcia', email: 'elena.garcia@email.es', role: 'BUYER', avatar: '', listingsCount: 0, status: 'active', joinedAt: '2024-01-12' },
  { id: '9', name: 'Thomas Brandt', email: 'thomas@bavaria-truck.de', role: 'SELLER', avatar: '', listingsCount: 67, status: 'active', joinedAt: '2023-02-14' },
  { id: '10', name: 'Lucca Bianchi', email: 'lucca@italtruck.it', role: 'SELLER', avatar: '', listingsCount: 8, status: 'active', joinedAt: '2023-12-01' },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage users and their permissions ({dummyUsers.length} total users)
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Listings
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Joined
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-primary">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={roleColors[user.role]}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span className="text-sm text-foreground">{user.listingsCount}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={user.status === 'active' ? 'success' : 'danger'}
                        className="capitalize"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.joinedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        {user.role !== 'ADMIN' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              'h-8 px-2',
                              user.status === 'active'
                                ? 'text-destructive hover:text-destructive'
                                : 'text-success hover:text-success'
                            )}
                            title={user.status === 'active' ? 'Ban User' : 'Activate User'}
                          >
                            {user.status === 'active' ? (
                              <ShieldOff className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          {openMenu === user.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border z-10 py-1 min-w-[140px]">
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <UserCircle className="w-4 h-4" />
                                View Profile
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                onClick={() => setOpenMenu(null)}
                              >
                                <Shield className="w-4 h-4" />
                                Change Role
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
    </div>
  );
}
