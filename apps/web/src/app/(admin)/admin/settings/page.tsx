'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  Mail,
  Shield,
  DollarSign,
  Image,
  Save,
  Bell,
  Database,
  Server,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface SiteLanguage {
  id: string;
  code: string;
  name: string;
  localName: string;
  countryCode: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const sections: SettingsSection[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const fallbackLanguages: SiteLanguage[] = [
  { id: '1', code: 'en', name: 'English', localName: 'International | English', countryCode: 'eu', isDefault: true, isActive: true, sortOrder: 0 },
  { id: '2', code: 'de', name: 'Deutsch', localName: 'Deutschland | Deutsch', countryCode: 'de', isDefault: false, isActive: true, sortOrder: 1 },
  { id: '3', code: 'nl', name: 'Nederlands', localName: 'België | Nederlands', countryCode: 'be', isDefault: false, isActive: true, sortOrder: 2 },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);
  const [languages, setLanguages] = useState<SiteLanguage[]>(fallbackLanguages);

  useEffect(() => {
    api.get<{ success: boolean; data: SiteLanguage[] }>('/languages')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setLanguages(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const [settings, setSettings] = useState({
    siteName: 'Menon Mobility',
    siteDescription: 'The world\'s premier marketplace for trucks, trailers, and commercial vehicles',
    contactEmail: 'info@menonmobility.com',
    supportEmail: 'support@menonmobility.com',
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    listingsPerPage: '20',
    listingExpiryDays: '90',
    maxImagesPerListing: '20',
    maxImageSizeMb: '10',
    requireApproval: true,
    allowGuestMessages: false,
    enableNotifications: true,
    enableNewsletter: true,
    smtpHost: 'smtp.mailgun.org',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@menonmobility.com',
    fromName: 'Menon Mobility',
    stripePublicKey: '',
    stripeSecretKey: '',
    enablePayments: false,
    maintenanceMode: false,
    enableRegistration: true,
    maxLoginAttempts: '5',
    sessionTimeout: '30',
    imageCompression: '85',
    thumbnailWidth: '300',
    mediumWidth: '600',
    largeWidth: '1200',
  });

  const handleChange = (key: string, value: string | boolean) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderInput = (key: string, label: string, type: 'text' | 'number' | 'password' | 'email' = 'text') => (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1">{label}</label>
      <input
        type={type}
        value={(settings as any)[key]}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  const renderToggle = (key: string, label: string, description: string) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => handleChange(key, !(settings as any)[key])}
        className={`relative w-11 h-6 rounded-full transition-colors ${(settings as any)[key] ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${(settings as any)[key] ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your marketplace configuration</p>
        </div>
        <Button variant="accent" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-48 shrink-0 hidden lg:block">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {/* Mobile section tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 lg:hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                <section.icon className="w-3 h-3" />
                {section.label}
              </button>
            ))}
          </div>

          {activeSection === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderInput('siteName', 'Site Name')}
                {renderInput('siteDescription', 'Site Description')}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput('contactEmail', 'Contact Email', 'email')}
                  {renderInput('supportEmail', 'Support Email', 'email')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Default Currency</label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) => handleChange('defaultCurrency', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="PLN">PLN - Polish Zloty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Default Language</label>
                    <select
                      value={settings.defaultLanguage}
                      onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput('listingsPerPage', 'Listings Per Page', 'number')}
                  {renderInput('listingExpiryDays', 'Listing Expiry (days)', 'number')}
                </div>
                <div className="pt-4 border-t border-border">
                  {renderToggle('requireApproval', 'Require Listing Approval', 'New listings must be approved by admin before going live')}
                  {renderToggle('maintenanceMode', 'Maintenance Mode', 'Show maintenance page to all visitors')}
                  {renderToggle('enableRegistration', 'Enable Registration', 'Allow new users to create accounts')}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput('smtpHost', 'SMTP Host')}
                  {renderInput('smtpPort', 'SMTP Port', 'number')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput('smtpUser', 'SMTP Username')}
                  {renderInput('smtpPassword', 'SMTP Password', 'password')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput('fromEmail', 'From Email', 'email')}
                  {renderInput('fromName', 'From Name')}
                </div>
                <div className="pt-4 border-t border-border">
                  {renderToggle('enableNewsletter', 'Enable Newsletter', 'Allow users to subscribe to email newsletters')}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput('maxLoginAttempts', 'Max Login Attempts', 'number')}
                  {renderInput('sessionTimeout', 'Session Timeout (minutes)', 'number')}
                </div>
                <div className="pt-4 border-t border-border">
                  {renderToggle('allowGuestMessages', 'Allow Guest Messages', 'Allow non-registered users to send messages to sellers')}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'payments' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderToggle('enablePayments', 'Enable Payments', 'Accept payments for subscriptions and featured listings')}
                <div className="pt-2">
                  {renderInput('stripePublicKey', 'Stripe Public Key')}
                  {renderInput('stripeSecretKey', 'Stripe Secret Key', 'password')}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'media' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Media Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput('maxImagesPerListing', 'Max Images Per Listing', 'number')}
                  {renderInput('maxImageSizeMb', 'Max Image Size (MB)', 'number')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {renderInput('thumbnailWidth', 'Thumbnail Width (px)', 'number')}
                  {renderInput('mediumWidth', 'Medium Width (px)', 'number')}
                  {renderInput('largeWidth', 'Large Width (px)', 'number')}
                </div>
                {renderInput('imageCompression', 'Image Quality (%)', 'number')}
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {renderToggle('enableNotifications', 'Enable Notifications', 'Send in-app and email notifications to users')}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
