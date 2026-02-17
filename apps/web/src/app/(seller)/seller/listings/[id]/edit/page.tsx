'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Truck,
  Container,
  Building2,
  Car,
  Package,
  Wrench,
  Tractor,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  Save,
  Search,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

/* ═══════════════════════════════════════════════════════════════════════
   CONSTANTS & CONFIGURATION (shared with create page)
   ═══════════════════════════════════════════════════════════════════════ */

const TOTAL_STEPS = 7;
const stepNames = ['Category', 'Basic Info', 'Vehicle Details', 'Description', 'Images', 'Location', 'Review'];

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

type FieldKey =
  | 'year' | 'mileageKm' | 'operatingHours' | 'fuelType' | 'transmission'
  | 'powerHp' | 'powerKw' | 'emissionClass' | 'axleCount' | 'cabType'
  | 'gvwKg' | 'payloadKg' | 'wheelbaseMm' | 'suspensionType'
  | 'containerSize' | 'containerType' | 'color' | 'vin';

const CATEGORY_FIELDS: Record<string, FieldKey[]> = {
  trucks: ['year', 'mileageKm', 'fuelType', 'transmission', 'powerHp', 'powerKw', 'emissionClass', 'axleCount', 'cabType', 'gvwKg', 'payloadKg', 'wheelbaseMm', 'suspensionType', 'color', 'vin'],
  trailers: ['year', 'mileageKm', 'axleCount', 'payloadKg', 'suspensionType', 'wheelbaseMm', 'color', 'vin'],
  construction: ['year', 'operatingHours', 'powerHp', 'powerKw', 'fuelType', 'gvwKg', 'color', 'vin'],
  vans: ['year', 'mileageKm', 'fuelType', 'transmission', 'powerHp', 'powerKw', 'emissionClass', 'color', 'vin'],
  cars: ['year', 'mileageKm', 'fuelType', 'transmission', 'powerHp', 'powerKw', 'emissionClass', 'color', 'vin'],
  containers: ['year', 'containerSize', 'containerType', 'color'],
  parts: [],
  agricultural: ['year', 'operatingHours', 'powerHp', 'powerKw', 'fuelType', 'transmission', 'color', 'vin'],
};

const conditionOptions = [
  { label: 'New', value: 'NEW' },
  { label: 'Used', value: 'USED' },
  { label: 'Refurbished', value: 'REFURBISHED' },
];

const fuelOptions = [
  { label: 'Diesel', value: 'DIESEL' },
  { label: 'Petrol', value: 'PETROL' },
  { label: 'Electric', value: 'ELECTRIC' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'LPG', value: 'LPG' },
  { label: 'CNG', value: 'CNG' },
  { label: 'Hydrogen', value: 'HYDROGEN' },
];

const transmissionOptions = [
  { label: 'Manual', value: 'MANUAL' },
  { label: 'Automatic', value: 'AUTOMATIC' },
  { label: 'Semi-Automatic', value: 'SEMI_AUTOMATIC' },
];

const emissionOptions = [
  { label: 'Euro 6d', value: 'EURO6D' },
  { label: 'Euro 6', value: 'EURO6' },
  { label: 'Euro 5', value: 'EURO5' },
  { label: 'Euro 4', value: 'EURO4' },
  { label: 'Euro 3', value: 'EURO3' },
  { label: 'Euro 2', value: 'EURO2' },
  { label: 'Euro 1', value: 'EURO1' },
];

const axleOptions = [
  { label: '2 Axles', value: '2' },
  { label: '3 Axles', value: '3' },
  { label: '4 Axles', value: '4' },
  { label: '5 Axles', value: '5' },
  { label: '6 Axles', value: '6' },
  { label: '7 Axles', value: '7' },
  { label: '8 Axles', value: '8' },
];

const cabTypeOptions = [
  { label: 'Day Cab', value: 'Day Cab' },
  { label: 'Sleeper Cab', value: 'Sleeper Cab' },
  { label: 'Double Cab', value: 'Double Cab' },
  { label: 'Extended Cab', value: 'Extended Cab' },
  { label: 'Crew Cab', value: 'Crew Cab' },
  { label: 'Low Entry Cab', value: 'Low Entry Cab' },
];

const suspensionOptions = [
  { label: 'Air Suspension', value: 'Air' },
  { label: 'Leaf Spring', value: 'Leaf Spring' },
  { label: 'Parabolic', value: 'Parabolic' },
  { label: 'Mechanical', value: 'Mechanical' },
];

const containerSizeOptions = [
  { label: '20 ft', value: 'FT20' },
  { label: '40 ft', value: 'FT40' },
  { label: '45 ft', value: 'FT45' },
];

const containerTypeOptions = [
  { label: 'Dry Van', value: 'Dry Van' },
  { label: 'Reefer', value: 'Reefer' },
  { label: 'Open Top', value: 'Open Top' },
  { label: 'Flat Rack', value: 'Flat Rack' },
  { label: 'Tank', value: 'Tank' },
  { label: 'Bulk', value: 'Bulk' },
];

const colorOptions = [
  'White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Brown', 'Beige', 'Other',
];

const countryOptions = [
  { label: 'Netherlands', value: 'NL' },
  { label: 'Germany', value: 'DE' },
  { label: 'Belgium', value: 'BE' },
  { label: 'France', value: 'FR' },
  { label: 'Poland', value: 'PL' },
  { label: 'Spain', value: 'ES' },
  { label: 'Italy', value: 'IT' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Austria', value: 'AT' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Norway', value: 'NO' },
  { label: 'Finland', value: 'FI' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Romania', value: 'RO' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Pakistan', value: 'PK' },
];

/* ─── Types ─── */

interface FormData {
  category: string;
  categoryId: string;
  title: string;
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  condition: string;
  price: string;
  priceType: string;
  year: string;
  mileageKm: string;
  operatingHours: string;
  fuelType: string;
  transmission: string;
  powerHp: string;
  powerKw: string;
  emissionClass: string;
  axleCount: string;
  cabType: string;
  gvwKg: string;
  payloadKg: string;
  wheelbaseMm: string;
  suspensionType: string;
  containerSize: string;
  containerType: string;
  color: string;
  vin: string;
  description: string;
  existingImages: { id: string; url: string }[];
  newImages: File[];
  countryCode: string;
  city: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
}

interface ApiBrand { id: string; name: string; slug: string; logoUrl: string | null; listingCount: number; modelCount: number; }
interface ApiModel { id: string; name: string; slug: string; listingCount: number; }

const selectClass = 'flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

function FormSelect({ label, value, onChange, options, placeholder = 'Select...', required }: {
  label: string; value: string; onChange: (val: string) => void;
  options: { label: string; value: string }[]; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}{required && ' *'}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="">{placeholder}</option>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    category: '', categoryId: '', title: '', brandId: '', brandName: '', modelId: '', modelName: '',
    condition: '', price: '', priceType: 'fixed', year: '', mileageKm: '', operatingHours: '',
    fuelType: '', transmission: '', powerHp: '', powerKw: '', emissionClass: '', axleCount: '',
    cabType: '', gvwKg: '', payloadKg: '', wheelbaseMm: '', suspensionType: '', containerSize: '',
    containerType: '', color: '', vin: '', description: '', existingImages: [], newImages: [],
    countryCode: '', city: '', contactPhone: '', contactEmail: '', contactWhatsapp: '',
  });

  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [models, setModels] = useState<ApiModel[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ── Fetch existing listing data ──
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<any>(`/seller/listings/${listingId}`);
        if (!res?.success || !res.data) {
          toast.error('Listing not found');
          router.push('/seller/listings');
          return;
        }
        const d = res.data;
        const catSlug = d.category?.slug || '';

        const priceType = d.priceOnRequest ? 'on-request' : d.priceNegotiable ? 'negotiable' : 'fixed';

        setFormData({
          category: catSlug,
          categoryId: d.categoryId || d.category?.id || '',
          title: d.title || '',
          brandId: d.brandId || '',
          brandName: d.brand?.name || '',
          modelId: d.modelId || '',
          modelName: d.model?.name || '',
          condition: d.condition || 'USED',
          price: d.price != null ? String(d.price) : '',
          priceType,
          year: d.year != null ? String(d.year) : '',
          mileageKm: d.mileageKm != null ? String(d.mileageKm) : '',
          operatingHours: d.operatingHours != null ? String(d.operatingHours) : '',
          fuelType: d.fuelType || '',
          transmission: d.transmission || '',
          powerHp: d.powerHp != null ? String(d.powerHp) : '',
          powerKw: d.powerKw != null ? String(d.powerKw) : '',
          emissionClass: d.emissionClass || '',
          axleCount: d.axleCount != null ? String(d.axleCount) : '',
          cabType: d.cabType || '',
          gvwKg: d.gvwKg != null ? String(d.gvwKg) : '',
          payloadKg: d.payloadKg != null ? String(d.payloadKg) : '',
          wheelbaseMm: d.wheelbaseMm != null ? String(d.wheelbaseMm) : '',
          suspensionType: d.suspensionType || '',
          containerSize: d.containerSize || '',
          containerType: d.containerType || '',
          color: d.color || '',
          vin: d.vin || '',
          description: d.description || '',
          existingImages: (d.images || []).map((img: any) => ({
            id: img.id,
            url: img.thumbnailUrl || img.mediumUrl || img.originalUrl,
          })),
          newImages: [],
          countryCode: d.countryCode || '',
          city: d.city || '',
          contactPhone: d.contactPhone || '',
          contactEmail: d.contactEmail || '',
          contactWhatsapp: d.contactWhatsapp || '',
        });
      } catch (err: any) {
        toast.error('Failed to load listing');
        router.push('/seller/listings');
      } finally {
        setLoading(false);
        setInitialLoadDone(true);
      }
    })();
  }, [listingId, router, updateField]);

  // ── Fetch brands when category set (after initial load) ──
  useEffect(() => {
    if (!formData.category || !initialLoadDone) return;
    (async () => {
      setBrandsLoading(true);
      try {
        const res = await api.get<any>(`/brands?category=${formData.category}`);
        if (res?.success) setBrands(res.data || []);
      } catch { setBrands([]); }
      finally { setBrandsLoading(false); }
    })();
  }, [formData.category, initialLoadDone]);

  // ── Fetch models when brand set ──
  useEffect(() => {
    if (!formData.brandId || !initialLoadDone) return;
    const brand = brands.find((b) => b.id === formData.brandId);
    if (!brand) return;
    (async () => {
      setModelsLoading(true);
      try {
        const res = await api.get<any>(`/brands/${brand.slug}`);
        if (res?.success) setModels(res.data?.models || []);
      } catch { setModels([]); }
      finally { setModelsLoading(false); }
    })();
  }, [formData.brandId, brands, initialLoadDone]);

  // ── Auto-calculate kW from HP ──
  useEffect(() => {
    if (formData.powerHp) {
      const hp = parseInt(formData.powerHp, 10);
      if (!isNaN(hp) && hp > 0) {
        updateField('powerKw', String(Math.round(hp * 0.7457)));
      }
    }
  }, [formData.powerHp, updateField]);

  const visibleFields = CATEGORY_FIELDS[formData.category] || [];
  const showField = (key: FieldKey) => visibleFields.includes(key);

  const canGoNext = () => {
    switch (step) {
      case 1: return !!formData.category;
      case 2: return !!formData.title && !!formData.condition;
      case 3: return formData.category === 'parts' || !!formData.year;
      case 4: return formData.description.length >= 50;
      case 5: return true;
      case 6: return !!formData.countryCode && !!formData.city;
      default: return true;
    }
  };

  // ── Image handling ──
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 10 * 1024 * 1024) { toast.error(`"${file.name}" exceeds 10MB`); continue; }
      validFiles.push(file);
    }
    const total = formData.existingImages.length + formData.newImages.length;
    const remaining = 20 - total;
    const toAdd = validFiles.slice(0, remaining);
    if (toAdd.length > 0) updateField('newImages', [...formData.newImages, ...toAdd]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // ── Submit update ──
  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const body: Record<string, any> = {
        title: formData.title.trim(),
        condition: formData.condition,
        description: formData.description.trim(),
      };

      if (formData.categoryId) body.categoryId = formData.categoryId;
      if (formData.brandId) body.brandId = formData.brandId;
      else body.brandId = null;
      if (formData.modelId) body.modelId = formData.modelId;
      else body.modelId = null;

      if (formData.priceType === 'on-request') {
        body.priceOnRequest = true; body.priceNegotiable = false; body.price = null;
      } else {
        body.priceOnRequest = false;
        body.price = formData.price ? parseFloat(formData.price) : null;
        body.priceNegotiable = formData.priceType === 'negotiable';
      }
      body.priceCurrency = 'EUR';

      if (formData.year) body.year = parseInt(formData.year, 10); else body.year = null;
      if (formData.mileageKm) body.mileageKm = parseInt(formData.mileageKm, 10); else body.mileageKm = null;
      if (formData.operatingHours) body.operatingHours = parseInt(formData.operatingHours, 10); else body.operatingHours = null;
      body.fuelType = formData.fuelType || null;
      body.transmission = formData.transmission || null;
      if (formData.powerHp) body.powerHp = parseInt(formData.powerHp, 10); else body.powerHp = null;
      if (formData.powerKw) body.powerKw = parseInt(formData.powerKw, 10); else body.powerKw = null;
      body.emissionClass = formData.emissionClass || null;
      if (formData.axleCount) body.axleCount = parseInt(formData.axleCount, 10); else body.axleCount = null;
      body.cabType = formData.cabType || null;
      if (formData.gvwKg) body.gvwKg = parseInt(formData.gvwKg, 10); else body.gvwKg = null;
      if (formData.payloadKg) body.payloadKg = parseInt(formData.payloadKg, 10); else body.payloadKg = null;
      if (formData.wheelbaseMm) body.wheelbaseMm = parseInt(formData.wheelbaseMm, 10); else body.wheelbaseMm = null;
      body.suspensionType = formData.suspensionType || null;
      body.containerSize = formData.containerSize || null;
      body.containerType = formData.containerType || null;
      body.color = formData.color || null;
      body.vin = formData.vin?.trim() || null;
      body.countryCode = formData.countryCode || null;
      body.city = formData.city?.trim() || null;
      body.contactPhone = formData.contactPhone?.trim() || null;
      body.contactEmail = formData.contactEmail?.trim() || null;
      body.contactWhatsapp = formData.contactWhatsapp?.trim() || null;

      const res = await api.put<any>(`/seller/listings/${listingId}`, body);
      if (!res?.success) {
        toast.error(res?.message || 'Failed to update listing');
        return;
      }

      // Upload new images if any
      if (formData.newImages.length > 0) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        for (let i = 0; i < formData.newImages.length; i += 10) {
          const batch = formData.newImages.slice(i, i + 10);
          const fd = new window.FormData();
          batch.forEach((file) => fd.append('images', file));
          await fetch(`${baseUrl}/seller/listings/${listingId}/images`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: fd,
          });
        }
      }

      toast.success('Listing updated successfully!');
      router.push('/seller/listings');
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBrands = brandSearch
    ? brands.filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands;

  const totalImages = formData.existingImages.length + formData.newImages.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/seller/listings')}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Listing</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Step {step} of {TOTAL_STEPS}: {stepNames[step - 1]}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={cn('h-2 flex-1 rounded-full transition-colors', i < step ? 'bg-accent' : 'bg-muted')} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {stepNames.map((name, i) => (
            <span key={name} className={cn(i === step - 1 && 'text-accent font-medium', 'hidden sm:block')}>{name}</span>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">

          {/* Step 1: Category */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categoryOptions.map((cat) => (
                  <button key={cat.slug} onClick={() => updateField('category', cat.slug)}
                    className={cn('flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                      formData.category === cat.slug ? 'border-accent bg-accent/5' : 'border-border hover:border-primary/30 hover:bg-muted/50')}>
                    <cat.icon className={cn('w-8 h-8', formData.category === cat.slug ? 'text-accent' : 'text-muted-foreground')} />
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
              <Input id="title" label="Title *" value={formData.title} onChange={(e) => updateField('title', e.target.value)} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Brand</label>
                  {brandsLoading ? (
                    <div className="flex items-center gap-2 h-10 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
                  ) : (
                    <>
                      {brands.length > 10 && (
                        <div className="relative mb-1.5">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <input type="text" placeholder="Search brands..." value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)}
                            className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-white text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                        </div>
                      )}
                      <select value={formData.brandId}
                        onChange={(e) => {
                          const brand = brands.find((b) => b.id === e.target.value);
                          updateField('brandId', e.target.value);
                          updateField('brandName', brand?.name || '');
                          updateField('modelId', '');
                          updateField('modelName', '');
                        }}
                        className={selectClass}>
                        <option value="">Select brand...</option>
                        {filteredBrands.map((b) => (
                          <option key={b.id} value={b.id}>{b.name} {b.listingCount > 0 ? `(${b.listingCount})` : ''}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Model</label>
                  {modelsLoading ? (
                    <div className="flex items-center gap-2 h-10 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
                  ) : formData.brandId ? (
                    <select value={formData.modelId}
                      onChange={(e) => {
                        const model = models.find((m) => m.id === e.target.value);
                        updateField('modelId', e.target.value);
                        updateField('modelName', model?.name || '');
                      }}
                      className={selectClass}>
                      <option value="">Select model...</option>
                      {models.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} {m.listingCount > 0 ? `(${m.listingCount})` : ''}</option>
                      ))}
                    </select>
                  ) : (
                    <select disabled className={cn(selectClass, 'opacity-50 cursor-not-allowed')}><option>Select a brand first</option></select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Condition *</label>
                <div className="flex flex-wrap gap-3">
                  {conditionOptions.map((cond) => (
                    <button key={cond.value} onClick={() => updateField('condition', cond.value)}
                      className={cn('px-6 py-2.5 rounded-lg border-2 text-sm font-medium transition-all',
                        formData.condition === cond.value ? 'border-accent bg-accent/5 text-accent' : 'border-border text-foreground hover:border-primary/30')}>
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="price" type="number" label="Price (EUR)" value={formData.price} onChange={(e) => updateField('price', e.target.value)} />
                <FormSelect label="Price Type" value={formData.priceType} onChange={(v) => updateField('priceType', v)}
                  options={[{ label: 'Fixed Price', value: 'fixed' }, { label: 'Negotiable', value: 'negotiable' }, { label: 'Price on Request', value: 'on-request' }]} />
              </div>
            </div>
          )}

          {/* Step 3: Vehicle Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">{formData.category === 'parts' ? 'Item Details' : 'Vehicle Details'}</h2>

              {formData.category === 'parts' ? (
                <p className="text-sm text-muted-foreground">No additional specifications needed for parts.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {showField('year') && <Input id="year" type="number" label="Year *" value={formData.year} onChange={(e) => updateField('year', e.target.value)} />}
                    {showField('mileageKm') && <Input id="mileageKm" type="number" label="Mileage (km)" value={formData.mileageKm} onChange={(e) => updateField('mileageKm', e.target.value)} />}
                    {showField('operatingHours') && <Input id="operatingHours" type="number" label="Operating Hours" value={formData.operatingHours} onChange={(e) => updateField('operatingHours', e.target.value)} />}
                  </div>

                  {(showField('fuelType') || showField('transmission')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('fuelType') && <FormSelect label="Fuel Type" value={formData.fuelType} onChange={(v) => updateField('fuelType', v)} options={fuelOptions} />}
                      {showField('transmission') && <FormSelect label="Transmission" value={formData.transmission} onChange={(v) => updateField('transmission', v)} options={transmissionOptions} />}
                    </div>
                  )}

                  {(showField('powerHp') || showField('powerKw')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('powerHp') && <Input id="powerHp" type="number" label="Power (HP)" value={formData.powerHp} onChange={(e) => updateField('powerHp', e.target.value)} />}
                      {showField('powerKw') && <Input id="powerKw" type="number" label="Power (kW)" value={formData.powerKw} onChange={(e) => updateField('powerKw', e.target.value)} />}
                    </div>
                  )}

                  {(showField('emissionClass') || showField('axleCount')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('emissionClass') && <FormSelect label="Emission Class" value={formData.emissionClass} onChange={(v) => updateField('emissionClass', v)} options={emissionOptions} />}
                      {showField('axleCount') && <FormSelect label="Axle Count" value={formData.axleCount} onChange={(v) => updateField('axleCount', v)} options={axleOptions} />}
                    </div>
                  )}

                  {(showField('cabType') || showField('suspensionType')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('cabType') && <FormSelect label="Cab Type" value={formData.cabType} onChange={(v) => updateField('cabType', v)} options={cabTypeOptions} />}
                      {showField('suspensionType') && <FormSelect label="Suspension" value={formData.suspensionType} onChange={(v) => updateField('suspensionType', v)} options={suspensionOptions} />}
                    </div>
                  )}

                  {(showField('gvwKg') || showField('payloadKg')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('gvwKg') && <Input id="gvwKg" type="number" label="GVW (kg)" value={formData.gvwKg} onChange={(e) => updateField('gvwKg', e.target.value)} />}
                      {showField('payloadKg') && <Input id="payloadKg" type="number" label="Payload (kg)" value={formData.payloadKg} onChange={(e) => updateField('payloadKg', e.target.value)} />}
                    </div>
                  )}

                  {showField('wheelbaseMm') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input id="wheelbaseMm" type="number" label="Wheelbase (mm)" value={formData.wheelbaseMm} onChange={(e) => updateField('wheelbaseMm', e.target.value)} />
                    </div>
                  )}

                  {(showField('containerSize') || showField('containerType')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('containerSize') && <FormSelect label="Container Size" value={formData.containerSize} onChange={(v) => updateField('containerSize', v)} options={containerSizeOptions} />}
                      {showField('containerType') && <FormSelect label="Container Type" value={formData.containerType} onChange={(v) => updateField('containerType', v)} options={containerTypeOptions} />}
                    </div>
                  )}

                  {(showField('color') || showField('vin')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('color') && <FormSelect label="Color" value={formData.color} onChange={(v) => updateField('color', v)} options={colorOptions.map((c) => ({ label: c, value: c }))} />}
                      {showField('vin') && <Input id="vin" label="VIN" value={formData.vin} onChange={(e) => updateField('vin', e.target.value)} />}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 4: Description */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
              <Textarea id="description" value={formData.description} onChange={(e) => updateField('description', e.target.value)} rows={10} showCharCount maxLength={5000} />
              {formData.description.length > 0 && formData.description.length < 50 && (
                <p className="text-xs text-destructive">Minimum 50 characters ({50 - formData.description.length} more needed)</p>
              )}
            </div>
          )}

          {/* Step 5: Images */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Images</h2>
              <p className="text-sm text-muted-foreground mb-4">Current: {formData.existingImages.length} | New: {formData.newImages.length} | Total: {totalImages}/20</p>

              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                className={cn('border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer', dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-primary/30')}
                onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => { handleFileSelect(e.target.files); e.target.value = ''; }} />
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Drag & drop or click to add more images</p>
              </div>

              {/* Existing images */}
              {formData.existingImages.length > 0 && (
                <>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Images</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {formData.existingImages.map((img, i) => (
                      <div key={img.id} className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden group">
                        <img src={img.url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && <Badge className="absolute top-1 left-1 bg-accent text-white text-[9px] border-0 px-1.5 py-0">Main</Badge>}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* New images */}
              {formData.newImages.length > 0 && (
                <>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Images</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {formData.newImages.map((file, i) => (
                      <div key={`new-${file.name}-${i}`} className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden group">
                        <img src={URL.createObjectURL(file)} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                        <button onClick={(e) => { e.stopPropagation(); updateField('newImages', formData.newImages.filter((_, idx) => idx !== i)); }}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 6: Location & Contact */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Location & Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Country" value={formData.countryCode} onChange={(v) => updateField('countryCode', v)} options={countryOptions} placeholder="Select country..." required />
                <Input id="city" label="City *" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="contactPhone" label="Phone" value={formData.contactPhone} onChange={(e) => updateField('contactPhone', e.target.value)} />
                <Input id="contactEmail" type="email" label="Email" value={formData.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="contactWhatsapp" label="WhatsApp" value={formData.contactWhatsapp} onChange={(e) => updateField('contactWhatsapp', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 7: Review */}
          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Review Changes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <ReviewRow label="Category" value={formData.category} />
                <ReviewRow label="Title" value={formData.title} />
                <ReviewRow label="Brand" value={formData.brandName || '-'} />
                <ReviewRow label="Model" value={formData.modelName || '-'} />
                <ReviewRow label="Condition" value={conditionOptions.find((c) => c.value === formData.condition)?.label || '-'} />
                <ReviewRow label="Price" value={formData.priceType === 'on-request' ? 'On request' : formData.price ? `EUR ${Number(formData.price).toLocaleString()}` : '-'} />
                {showField('year') && <ReviewRow label="Year" value={formData.year || '-'} />}
                {showField('mileageKm') && <ReviewRow label="Mileage" value={formData.mileageKm ? `${Number(formData.mileageKm).toLocaleString()} km` : '-'} />}
                {showField('operatingHours') && <ReviewRow label="Operating Hours" value={formData.operatingHours ? `${Number(formData.operatingHours).toLocaleString()} hrs` : '-'} />}
                {showField('fuelType') && <ReviewRow label="Fuel Type" value={fuelOptions.find((f) => f.value === formData.fuelType)?.label || '-'} />}
                {showField('transmission') && <ReviewRow label="Transmission" value={transmissionOptions.find((t) => t.value === formData.transmission)?.label || '-'} />}
                {showField('powerHp') && <ReviewRow label="Power" value={formData.powerHp ? `${formData.powerHp} HP (${formData.powerKw} kW)` : '-'} />}
                {showField('emissionClass') && <ReviewRow label="Emission" value={emissionOptions.find((e) => e.value === formData.emissionClass)?.label || '-'} />}
                {showField('axleCount') && <ReviewRow label="Axles" value={formData.axleCount || '-'} />}
                {showField('cabType') && <ReviewRow label="Cab Type" value={formData.cabType || '-'} />}
                {showField('gvwKg') && <ReviewRow label="GVW" value={formData.gvwKg ? `${Number(formData.gvwKg).toLocaleString()} kg` : '-'} />}
                {showField('payloadKg') && <ReviewRow label="Payload" value={formData.payloadKg ? `${Number(formData.payloadKg).toLocaleString()} kg` : '-'} />}
                {showField('suspensionType') && <ReviewRow label="Suspension" value={formData.suspensionType || '-'} />}
                {showField('containerSize') && <ReviewRow label="Container Size" value={containerSizeOptions.find((c) => c.value === formData.containerSize)?.label || '-'} />}
                {showField('containerType') && <ReviewRow label="Container Type" value={formData.containerType || '-'} />}
                {showField('color') && <ReviewRow label="Color" value={formData.color || '-'} />}
                {showField('vin') && <ReviewRow label="VIN" value={formData.vin || '-'} />}
                <ReviewRow label="Images" value={`${totalImages} total`} />
                <ReviewRow label="Country" value={countryOptions.find((c) => c.value === formData.countryCode)?.label || '-'} />
                <ReviewRow label="City" value={formData.city || '-'} />
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>{step > 1 && (<Button variant="outline" onClick={() => setStep(step - 1)}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>)}</div>
        <div className="flex items-center gap-3">
          {step < TOTAL_STEPS ? (
            <Button variant="accent" onClick={() => setStep(step + 1)} disabled={!canGoNext()}>
              Next<ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="accent" onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Saving...</> : <><Check className="w-4 h-4 mr-1.5" />Update Listing</>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-border">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground capitalize">{value}</span>
    </div>
  );
}
