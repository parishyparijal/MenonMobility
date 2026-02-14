'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  Save,
  Truck,
  Container,
  Building2,
  Car,
  Package,
  Wrench,
  Tractor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 7;

const stepNames = [
  'Category',
  'Basic Info',
  'Vehicle Details',
  'Description',
  'Images',
  'Location',
  'Review',
];

const categoryOptions = [
  { name: 'Trucks', slug: 'trucks', icon: Truck },
  { name: 'Trailers', slug: 'trailers', icon: Container },
  { name: 'Construction', slug: 'construction', icon: Building2 },
  { name: 'Vans', slug: 'vans', icon: Car },
  { name: 'Cars', slug: 'cars', icon: Car },
  { name: 'Containers', slug: 'containers', icon: Package },
  { name: 'Parts', slug: 'parts', icon: Wrench },
  { name: 'Agricultural', slug: 'agricultural', icon: Tractor },
];

const conditionOptions = ['New', 'Used'];
const fuelOptions = ['Diesel', 'Electric', 'Hybrid', 'LNG', 'CNG', 'Petrol'];
const transmissionOptions = ['Manual', 'Automatic', 'Semi-automatic'];
const emissionOptions = ['Euro 6', 'Euro 5', 'Euro 4', 'Euro 3', 'Stage V', 'Stage IV'];
const countryOptions = [
  'Netherlands', 'Germany', 'Belgium', 'France', 'Poland', 'Spain', 'Italy',
  'United Kingdom', 'Czech Republic', 'Austria', 'Sweden', 'Denmark',
];

interface FormData {
  category: string;
  title: string;
  brand: string;
  model: string;
  condition: string;
  price: string;
  priceType: string;
  year: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  power: string;
  emissionClass: string;
  description: string;
  images: string[];
  country: string;
  city: string;
  phone: string;
  email: string;
}

// Pre-populated demo data (would come from API in real app)
const existingListing: FormData = {
  category: 'trucks',
  title: 'Mercedes-Benz Actros 2545 LS 6x2 StreamSpace',
  brand: 'Mercedes-Benz',
  model: 'Actros 2545 LS',
  condition: 'used',
  price: '89500',
  priceType: 'negotiable',
  year: '2021',
  mileage: '185000',
  fuelType: 'diesel',
  transmission: 'automatic',
  power: '330 kW (449 HP)',
  emissionClass: 'euro 6',
  description: 'Well-maintained 2021 Mercedes-Benz Actros 2545 LS 6x2 with StreamSpace cab. Full dealer service history, always serviced on time. Equipped with PPC (Predictive Powertrain Control), MirrorCam system, and Multimedia Cockpit. New front tires fitted. MOT valid until December 2024. Available for immediate delivery from our Rotterdam location. Contact us for a test drive.',
  images: ['img-1', 'img-2', 'img-3', 'img-4'],
  country: 'netherlands',
  city: 'Rotterdam',
  phone: '+31 10 123 4567',
  email: 'info@transeuropa.nl',
};

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(existingListing);
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canGoNext = () => {
    switch (step) {
      case 1: return !!formData.category;
      case 2: return !!formData.title && !!formData.brand && !!formData.condition;
      case 3: return !!formData.year;
      case 4: return formData.description.length >= 50;
      case 5: return true;
      case 6: return !!formData.country && !!formData.city;
      default: return true;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const fileCount = e.dataTransfer.files.length;
    const newPlaceholders = Array.from({ length: fileCount }, (_, i) =>
      `placeholder-${formData.images.length + i}`
    );
    updateField('images', [...formData.images, ...newPlaceholders].slice(0, 20));
  };

  const removeImage = (index: number) => {
    updateField('images', formData.images.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    router.push('/seller/listings');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/seller/listings')}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Listing</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Step {step} of {TOTAL_STEPS}: {stepNames[step - 1]}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors',
                i < step ? 'bg-accent' : 'bg-muted'
              )}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {stepNames.map((name, i) => (
            <span key={name} className={cn(i === step - 1 && 'text-accent font-medium', 'hidden sm:block')}>
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Select a Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => updateField('category', cat.slug)}
                    className={cn(
                      'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                      formData.category === cat.slug
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    )}
                  >
                    <cat.icon className={cn('w-8 h-8', formData.category === cat.slug ? 'text-accent' : 'text-muted-foreground')} />
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
              <Input id="title" label="Title *" value={formData.title} onChange={(e) => updateField('title', e.target.value)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="brand" label="Brand *" value={formData.brand} onChange={(e) => updateField('brand', e.target.value)} />
                <Input id="model" label="Model" value={formData.model} onChange={(e) => updateField('model', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Condition *</label>
                <div className="flex gap-3">
                  {conditionOptions.map((cond) => (
                    <button
                      key={cond}
                      onClick={() => updateField('condition', cond.toLowerCase())}
                      className={cn(
                        'px-6 py-2.5 rounded-lg border-2 text-sm font-medium transition-all',
                        formData.condition === cond.toLowerCase() ? 'border-accent bg-accent/5 text-accent' : 'border-border text-foreground hover:border-primary/30'
                      )}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="price" type="number" label="Price (EUR)" value={formData.price} onChange={(e) => updateField('price', e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Price Type</label>
                  <select value={formData.priceType} onChange={(e) => updateField('priceType', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="fixed">Fixed Price</option>
                    <option value="negotiable">Negotiable</option>
                    <option value="on-request">Price on Request</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="year" type="number" label="Year *" value={formData.year} onChange={(e) => updateField('year', e.target.value)} />
                <Input id="mileage" type="number" label="Mileage (km)" value={formData.mileage} onChange={(e) => updateField('mileage', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Fuel Type</label>
                  <select value={formData.fuelType} onChange={(e) => updateField('fuelType', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select...</option>
                    {fuelOptions.map((f) => (<option key={f} value={f.toLowerCase()}>{f}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Transmission</label>
                  <select value={formData.transmission} onChange={(e) => updateField('transmission', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select...</option>
                    {transmissionOptions.map((t) => (<option key={t} value={t.toLowerCase()}>{t}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="power" label="Power" value={formData.power} onChange={(e) => updateField('power', e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Emission Class</label>
                  <select value={formData.emissionClass} onChange={(e) => updateField('emissionClass', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select...</option>
                    {emissionOptions.map((e) => (<option key={e} value={e.toLowerCase()}>{e}</option>))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
              <Textarea id="description" value={formData.description} onChange={(e) => updateField('description', e.target.value)} rows={10} showCharCount maxLength={5000} />
              {formData.description.length > 0 && formData.description.length < 50 && (
                <p className="text-xs text-destructive">Minimum 50 characters ({50 - formData.description.length} more needed)</p>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Images</h2>
              <p className="text-sm text-muted-foreground mb-4">Upload up to 20 images.</p>
              <div
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                className={cn('border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer', dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-primary/30')}
                onClick={() => { if (formData.images.length < 20) updateField('images', [...formData.images, `placeholder-${formData.images.length}`]); }}
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Drag & drop or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">{formData.images.length}/20 uploaded</p>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden group">
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">{i + 1}</div>
                      {i === 0 && <Badge className="absolute top-1 left-1 bg-accent text-white text-[9px] border-0 px-1.5 py-0">Main</Badge>}
                      <button onClick={(e) => { e.stopPropagation(); removeImage(i); }} className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Location & Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Country *</label>
                  <select value={formData.country} onChange={(e) => updateField('country', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select country...</option>
                    {countryOptions.map((c) => (<option key={c} value={c.toLowerCase()}>{c}</option>))}
                  </select>
                </div>
                <Input id="city" label="City *" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="phone" label="Contact Phone" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                <Input id="email" type="email" label="Contact Email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Review Changes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  ['Category', formData.category],
                  ['Title', formData.title],
                  ['Brand', formData.brand],
                  ['Model', formData.model],
                  ['Condition', formData.condition],
                  ['Price', formData.price ? `EUR ${Number(formData.price).toLocaleString()}` : 'On request'],
                  ['Year', formData.year],
                  ['Mileage', formData.mileage ? `${Number(formData.mileage).toLocaleString()} km` : '-'],
                  ['Fuel Type', formData.fuelType],
                  ['Transmission', formData.transmission],
                  ['Power', formData.power],
                  ['Emission', formData.emissionClass],
                  ['Images', `${formData.images.length} uploaded`],
                  ['Country', formData.country],
                  ['City', formData.city],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground capitalize">{value || '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>{step > 1 && (<Button variant="outline" onClick={() => setStep(step - 1)}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>)}</div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => handleSave()}>
            <Save className="w-4 h-4 mr-1.5" />{isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          {step < TOTAL_STEPS ? (
            <Button variant="accent" onClick={() => setStep(step + 1)} disabled={!canGoNext()}>
              Next<ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="accent" onClick={handleSave} disabled={isSaving}>
              <Check className="w-4 h-4 mr-1.5" />Update Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
