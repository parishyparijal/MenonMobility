'use client';

import { useState } from 'react';
import { Upload, Save, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const countryOptions = [
  'Netherlands', 'Germany', 'Belgium', 'France', 'Poland', 'Spain', 'Italy',
  'United Kingdom', 'Czech Republic', 'Austria', 'Sweden', 'Denmark',
];

export default function SellerProfilePage() {
  const [formData, setFormData] = useState({
    companyName: 'TransEuropa BV',
    description: 'TransEuropa BV is one of the leading commercial vehicle dealers in the Netherlands, specializing in trucks and tractor units from all major European manufacturers.',
    website: 'https://transeuropa.nl',
    phone: '+31 10 123 4567',
    address: 'Industrieweg 45',
    city: 'Rotterdam',
    region: 'South Holland',
    country: 'netherlands',
    postalCode: '3045 AH',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Company Profile</h1>
        <p className="text-muted-foreground mt-1">
          Update your company information visible to buyers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="w-5 h-5" />
              Company Logo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-muted-foreground border-2 border-dashed border-border">
                <span className="text-3xl font-bold text-primary">
                  {formData.companyName.charAt(0)}
                </span>
              </div>
              <div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 200x200px, JPG or PNG, max 2MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="companyName"
              name="companyName"
              label="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <Textarea
              id="description"
              name="description"
              label="Description"
              placeholder="Tell buyers about your company..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
              showCharCount
              maxLength={2000}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="website"
                name="website"
                label="Website"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={handleChange}
              />
              <Input
                id="phone"
                name="phone"
                label="Phone"
                placeholder="+31 10 123 4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="address"
              name="address"
              label="Street Address"
              placeholder="Industrieweg 45"
              value={formData.address}
              onChange={handleChange}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="city"
                name="city"
                label="City"
                placeholder="Rotterdam"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                id="region"
                name="region"
                label="Region / State"
                placeholder="South Holland"
                value={formData.region}
                onChange={handleChange}
              />
              <Input
                id="postalCode"
                name="postalCode"
                label="Postal Code"
                placeholder="3045 AH"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select country...</option>
                {countryOptions.map((c) => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex items-center justify-between">
          {saved && (
            <p className="text-sm text-success font-medium">Profile saved successfully!</p>
          )}
          {!saved && <div />}
          <Button type="submit" variant="accent" disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
