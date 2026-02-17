'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Mail,
  MailOpen,
  RefreshCw,
  Loader2,
  Key,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

/* ─── Types ─── */

interface MailpitMessage {
  ID: string;
  MessageID: string;
  From: { Name: string; Address: string };
  To: { Name: string; Address: string }[];
  Subject: string;
  Snippet: string;
  Created: string;
  Size: number;
  Read: boolean;
}

interface MailpitDetail {
  ID: string;
  From: { Name: string; Address: string };
  To: { Name: string; Address: string }[];
  Subject: string;
  Text: string;
  HTML: string;
  Created: string;
}

interface VerificationCode {
  id: string;
  email: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}

/* ─── Helpers ─── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ─── Component ─── */

export default function AdminEmailInboxPage() {
  const [tab, setTab] = useState<'inbox' | 'codes'>('inbox');

  // Inbox state
  const [emails, setEmails] = useState<MailpitMessage[]>([]);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<MailpitDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Codes state
  const [codes, setCodes] = useState<VerificationCode[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');

  // Fetch emails
  const fetchEmails = useCallback(async () => {
    setEmailsLoading(true);
    try {
      const res = await api.get<any>('/admin/email-inbox?limit=50');
      if (res?.success) {
        setEmails(res.data?.messages || []);
      }
    } catch {
      setEmails([]);
    } finally {
      setEmailsLoading(false);
    }
  }, []);

  // Fetch verification codes
  const fetchCodes = useCallback(async () => {
    setCodesLoading(true);
    try {
      const params = codeSearch ? `?email=${encodeURIComponent(codeSearch)}` : '';
      const res = await api.get<any>(`/admin/verification-codes${params}`);
      if (res?.success) {
        setCodes(res.data || []);
      }
    } catch {
      setCodes([]);
    } finally {
      setCodesLoading(false);
    }
  }, [codeSearch]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  useEffect(() => {
    if (tab === 'codes') fetchCodes();
  }, [tab, fetchCodes]);

  // Fetch email detail
  const handleSelectEmail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await api.get<any>(`/admin/email-inbox/${id}`);
      if (res?.success) setSelectedEmail(res.data);
    } catch {
      setSelectedEmail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Testing</h1>
          <p className="text-muted-foreground mt-1">
            View all caught emails and verification codes (Mailpit)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { fetchEmails(); fetchCodes(); }}
        >
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={tab === 'inbox' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('inbox')}
        >
          <Mail className="w-4 h-4 mr-1.5" />
          Email Inbox ({emails.length})
        </Button>
        <Button
          variant={tab === 'codes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('codes')}
        >
          <Key className="w-4 h-4 mr-1.5" />
          Verification Codes
        </Button>
      </div>

      {/* Email Inbox Tab */}
      {tab === 'inbox' && (
        <>
          {selectedEmail ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEmail(null)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{selectedEmail.Subject}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      From: {selectedEmail.From.Name || selectedEmail.From.Address} &rarr; To: {selectedEmail.To.map(t => t.Address).join(', ')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedEmail.HTML ? (
                  <div
                    className="prose prose-sm max-w-none border rounded-lg p-4 bg-white"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.HTML }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-foreground bg-muted/30 rounded-lg p-4">
                    {selectedEmail.Text}
                  </pre>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                {emailsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : emails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Mail className="w-10 h-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No emails caught yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Register a new user and the verification email will appear here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {emails.map((email) => (
                      <button
                        key={email.ID}
                        onClick={() => handleSelectEmail(email.ID)}
                        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="pt-0.5">
                          {email.Read ? (
                            <MailOpen className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Mail className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-foreground truncate">
                              {email.To.map(t => t.Address).join(', ')}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {timeAgo(email.Created)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground truncate">{email.Subject}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {email.Snippet}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Verification Codes Tab */}
      {tab === 'codes' && (
        <>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by email..."
              value={codeSearch}
              onChange={(e) => setCodeSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCodes()}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Card>
            <CardContent className="p-0">
              {codesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : codes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Key className="w-10 h-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No verification codes found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Code</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {codes.map((code) => {
                        const isExpired = new Date(code.expiresAt) < new Date();
                        return (
                          <tr key={code.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                            <td className="py-3 px-4 text-sm text-foreground">{code.email}</td>
                            <td className="py-3 px-4">
                              <code className="text-lg font-bold tracking-widest text-primary bg-primary-50 px-3 py-1 rounded">
                                {code.code}
                              </code>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={isExpired ? 'danger' : 'success'}>
                                {isExpired ? 'Expired' : 'Active'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {timeAgo(code.createdAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
