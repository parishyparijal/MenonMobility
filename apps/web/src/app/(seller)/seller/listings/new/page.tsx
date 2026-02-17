'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
   CONSTANTS & CONFIGURATION
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

// Which vehicle-detail fields appear for each category
type FieldKey =
  | 'year' | 'mileageKm' | 'operatingHours' | 'fuelType' | 'transmission'
  | 'powerHp' | 'powerKw' | 'emissionClass' | 'axleCount' | 'cabType'
  | 'gvwKg' | 'payloadKg' | 'wheelbaseMm' | 'suspensionType'
  | 'containerSize' | 'containerType' | 'color' | 'vin'
  | 'bodyType' | 'driveConfiguration' | 'numberOfDoors' | 'numberOfSeats';

const CATEGORY_FIELDS: Record<string, FieldKey[]> = {
  trucks: ['bodyType', 'year', 'mileageKm', 'fuelType', 'transmission', 'powerHp', 'powerKw', 'emissionClass', 'driveConfiguration', 'cabType', 'gvwKg', 'payloadKg', 'wheelbaseMm', 'suspensionType', 'color', 'vin'],
  trailers: ['bodyType', 'year', 'mileageKm', 'axleCount', 'payloadKg', 'suspensionType', 'wheelbaseMm', 'color', 'vin'],
  construction: ['bodyType', 'year', 'operatingHours', 'powerHp', 'powerKw', 'fuelType', 'gvwKg', 'color', 'vin'],
  vans: ['bodyType', 'year', 'mileageKm', 'fuelType', 'transmission', 'powerHp', 'powerKw', 'emissionClass', 'driveConfiguration', 'numberOfDoors', 'numberOfSeats', 'color', 'vin'],
  cars: ['bodyType', 'year', 'mileageKm', 'fuelType', 'transmission', 'powerHp', 'powerKw', 'emissionClass', 'driveConfiguration', 'numberOfDoors', 'numberOfSeats', 'color', 'vin'],
  containers: ['year', 'containerSize', 'containerType', 'color'],
  parts: [],
  agricultural: ['bodyType', 'year', 'operatingHours', 'powerHp', 'powerKw', 'fuelType', 'transmission', 'color', 'vin'],
};

/* ── Dropdown option arrays ─── */

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

/* ── Body Type options per category ─── */
const bodyTypeOptions: Record<string, { label: string; value: string }[]> = {
  trucks: [
    { label: 'Tractor Unit', value: 'Tractor Unit' },
    { label: 'Box Truck', value: 'Box Truck' },
    { label: 'Curtainside', value: 'Curtainside' },
    { label: 'Flatbed', value: 'Flatbed' },
    { label: 'Tipper / Dump Truck', value: 'Tipper' },
    { label: 'Tanker', value: 'Tanker' },
    { label: 'Refrigerated Truck', value: 'Refrigerated Truck' },
    { label: 'Crane Truck', value: 'Crane Truck' },
    { label: 'Concrete Mixer', value: 'Concrete Mixer' },
    { label: 'Car Transporter', value: 'Car Transporter' },
    { label: 'Hook Lift', value: 'Hook Lift' },
    { label: 'Skip Loader', value: 'Skip Loader' },
    { label: 'Swap Body', value: 'Swap Body' },
    { label: 'Chassis Cab', value: 'Chassis Cab' },
    { label: 'Logging Truck', value: 'Logging Truck' },
    { label: 'Fire Truck', value: 'Fire Truck' },
    { label: 'Municipal Vehicle', value: 'Municipal Vehicle' },
    { label: 'Recovery Vehicle', value: 'Recovery Vehicle' },
  ],
  trailers: [
    { label: 'Curtainside', value: 'Curtainside' },
    { label: 'Box / Dry Van', value: 'Box' },
    { label: 'Flatbed', value: 'Flatbed' },
    { label: 'Lowloader', value: 'Lowloader' },
    { label: 'Tipper', value: 'Tipper' },
    { label: 'Tanker', value: 'Tanker' },
    { label: 'Refrigerated', value: 'Refrigerated' },
    { label: 'Container Chassis', value: 'Container Chassis' },
    { label: 'Walking Floor', value: 'Walking Floor' },
    { label: 'Car Transporter', value: 'Car Transporter' },
    { label: 'Log Trailer', value: 'Log Trailer' },
    { label: 'Silo / Bulk', value: 'Silo' },
    { label: 'Platform', value: 'Platform' },
    { label: 'Livestock', value: 'Livestock' },
  ],
  cars: [
    { label: 'Sedan / Saloon', value: 'Sedan' },
    { label: 'Hatchback', value: 'Hatchback' },
    { label: 'Station Wagon / Estate', value: 'Station Wagon' },
    { label: 'SUV / Crossover', value: 'SUV' },
    { label: 'Coupe', value: 'Coupe' },
    { label: 'Convertible / Cabriolet', value: 'Convertible' },
    { label: 'Van / MPV', value: 'MPV' },
    { label: 'Pickup Truck', value: 'Pickup' },
    { label: 'Limousine', value: 'Limousine' },
  ],
  vans: [
    { label: 'Panel Van', value: 'Panel Van' },
    { label: 'Box Van', value: 'Box Van' },
    { label: 'Curtainside Van', value: 'Curtainside Van' },
    { label: 'Refrigerated Van', value: 'Refrigerated Van' },
    { label: 'Tipper Van', value: 'Tipper Van' },
    { label: 'Crew Van', value: 'Crew Van' },
    { label: 'Minibus', value: 'Minibus' },
    { label: 'Chassis Cab', value: 'Chassis Cab' },
    { label: 'Dropside Van', value: 'Dropside Van' },
    { label: 'Luton Van', value: 'Luton Van' },
  ],
  construction: [
    { label: 'Mini Excavator', value: 'Mini Excavator' },
    { label: 'Crawler Excavator', value: 'Crawler Excavator' },
    { label: 'Wheel Excavator', value: 'Wheel Excavator' },
    { label: 'Wheel Loader', value: 'Wheel Loader' },
    { label: 'Skid Steer Loader', value: 'Skid Steer Loader' },
    { label: 'Backhoe Loader', value: 'Backhoe Loader' },
    { label: 'Bulldozer', value: 'Bulldozer' },
    { label: 'Telehandler', value: 'Telehandler' },
    { label: 'Mobile Crane', value: 'Mobile Crane' },
    { label: 'Tower Crane', value: 'Tower Crane' },
    { label: 'Crawler Crane', value: 'Crawler Crane' },
    { label: 'Dumper', value: 'Dumper' },
    { label: 'Compactor / Roller', value: 'Compactor' },
    { label: 'Concrete Pump', value: 'Concrete Pump' },
    { label: 'Piling Rig', value: 'Piling Rig' },
    { label: 'Generator', value: 'Generator' },
    { label: 'Aerial Platform / Cherry Picker', value: 'Aerial Platform' },
    { label: 'Forklift', value: 'Forklift' },
  ],
  agricultural: [
    { label: 'Tractor', value: 'Tractor' },
    { label: 'Combine Harvester', value: 'Combine Harvester' },
    { label: 'Sprayer', value: 'Sprayer' },
    { label: 'Plough', value: 'Plough' },
    { label: 'Seeder', value: 'Seeder' },
    { label: 'Baler', value: 'Baler' },
    { label: 'Mower', value: 'Mower' },
    { label: 'Trailer', value: 'Trailer' },
    { label: 'Loader', value: 'Loader' },
    { label: 'Telehandler', value: 'Telehandler' },
  ],
};

/* ── Drive Configuration options ─── */
const truckDriveOptions = [
  { label: '4x2', value: '4x2' },
  { label: '4x4', value: '4x4' },
  { label: '6x2', value: '6x2' },
  { label: '6x4', value: '6x4' },
  { label: '6x6', value: '6x6' },
  { label: '8x2', value: '8x2' },
  { label: '8x4', value: '8x4' },
  { label: '8x6', value: '8x6' },
  { label: '8x8', value: '8x8' },
  { label: '10x4', value: '10x4' },
  { label: '10x6', value: '10x6' },
  { label: '10x8', value: '10x8' },
];

const carDriveOptions = [
  { label: 'Front Wheel Drive (FWD)', value: 'FWD' },
  { label: 'Rear Wheel Drive (RWD)', value: 'RWD' },
  { label: 'All Wheel Drive (AWD)', value: 'AWD' },
  { label: 'Four Wheel Drive (4WD)', value: '4WD' },
];

const doorsOptions = [
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];

const seatsOptions = [
  { label: '2', value: '2' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9+', value: '9' },
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

/* ═══════════════════════════════════════════════════════════════════════
   FORM DATA INTERFACE
   ═══════════════════════════════════════════════════════════════════════ */

interface FormData {
  // Step 1
  category: string;
  // Step 2
  title: string;
  brandId: string;
  brandName: string; // display label
  modelId: string;
  modelName: string; // display label
  condition: string;
  price: string;
  priceType: string;
  // Step 3 — category-dependent
  year: string;
  mileageKm: string;
  operatingHours: string;
  fuelType: string;
  transmission: string;
  powerHp: string;
  powerKw: string;
  emissionClass: string;
  bodyType: string;
  driveConfiguration: string;
  numberOfDoors: string;
  numberOfSeats: string;
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
  // Step 4
  description: string;
  // Step 5
  images: File[];
  // Step 6
  countryCode: string;
  city: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
}

const INITIAL_FORM: FormData = {
  category: '',
  title: '',
  brandId: '',
  brandName: '',
  modelId: '',
  modelName: '',
  condition: '',
  price: '',
  priceType: 'fixed',
  year: '',
  mileageKm: '',
  operatingHours: '',
  fuelType: '',
  transmission: '',
  powerHp: '',
  powerKw: '',
  emissionClass: '',
  bodyType: '',
  driveConfiguration: '',
  numberOfDoors: '',
  numberOfSeats: '',
  axleCount: '',
  cabType: '',
  gvwKg: '',
  payloadKg: '',
  wheelbaseMm: '',
  suspensionType: '',
  containerSize: '',
  containerType: '',
  color: '',
  vin: '',
  description: '',
  images: [],
  countryCode: '',
  city: '',
  contactPhone: '',
  contactEmail: '',
  contactWhatsapp: '',
};

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface ApiBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  listingCount: number;
  modelCount: number;
}

interface ApiModel {
  id: string;
  name: string;
  slug: string;
  listingCount: number;
}

interface ApiCategory {
  id: string;
  slug: string;
  name: any;
  parentId: string | null;
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPER: Select component
   ═══════════════════════════════════════════════════════════════════════ */

const selectClass = 'flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  required,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}{required && ' *'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API data
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [models, setModels] = useState<ApiModel[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  // ── Field update helper ──
  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ── Fetch categories on mount (for ID lookup) ──
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<any>('/categories?flat=true');
        if (res?.success) setCategories(res.data || []);
      } catch { /* ignore */ }
    })();
  }, []);

  // ── Fetch brands when category changes ──
  useEffect(() => {
    if (!formData.category) {
      setBrands([]);
      return;
    }
    (async () => {
      setBrandsLoading(true);
      try {
        const res = await api.get<any>(`/brands?category=${formData.category}`);
        if (res?.success) setBrands(res.data || []);
      } catch {
        setBrands([]);
      } finally {
        setBrandsLoading(false);
      }
    })();
    // Reset brand/model when category changes
    updateField('brandId', '');
    updateField('brandName', '');
    updateField('modelId', '');
    updateField('modelName', '');
    setModels([]);
  }, [formData.category, updateField]);

  // ── Fetch models when brand changes ──
  useEffect(() => {
    if (!formData.brandId) {
      setModels([]);
      return;
    }
    const brand = brands.find((b) => b.id === formData.brandId);
    if (!brand) return;
    (async () => {
      setModelsLoading(true);
      try {
        const res = await api.get<any>(`/brands/${brand.slug}`);
        if (res?.success) setModels(res.data?.models || []);
      } catch {
        setModels([]);
      } finally {
        setModelsLoading(false);
      }
    })();
    // Reset model when brand changes
    updateField('modelId', '');
    updateField('modelName', '');
  }, [formData.brandId, brands, updateField]);

  // ── Auto-calculate kW from HP ──
  useEffect(() => {
    if (formData.powerHp) {
      const hp = parseInt(formData.powerHp, 10);
      if (!isNaN(hp) && hp > 0) {
        updateField('powerKw', String(Math.round(hp * 0.7457)));
      }
    }
  }, [formData.powerHp, updateField]);

  // ── Which fields to show in Step 3 ──
  const visibleFields = CATEGORY_FIELDS[formData.category] || [];
  const showField = (key: FieldKey) => visibleFields.includes(key);

  // ── Validation per step ──
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
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not an image file`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 10MB limit`);
        continue;
      }
      validFiles.push(file);
    }
    const remaining = 20 - formData.images.length;
    if (validFiles.length > remaining) {
      toast.error(`Only ${remaining} more image(s) can be added`);
    }
    const toAdd = validFiles.slice(0, remaining);
    if (toAdd.length > 0) {
      updateField('images', [...formData.images, ...toAdd]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    updateField('images', formData.images.filter((_, i) => i !== index));
  };

  // ── Resolve category slug → UUID ──
  const getCategoryId = useCallback((): string | null => {
    // Try exact slug match first
    const exact = categories.find((c) => c.slug === formData.category);
    if (exact) return exact.id;
    // Fallback: check if any child category matches
    return null;
  }, [categories, formData.category]);

  // ── Build API body ──
  const buildApiBody = useCallback(() => {
    const categoryId = getCategoryId();
    if (!categoryId) return null;

    const body: Record<string, any> = {
      categoryId,
      title: formData.title.trim(),
      condition: formData.condition,
    };

    if (formData.brandId) body.brandId = formData.brandId;
    if (formData.modelId) body.modelId = formData.modelId;
    if (formData.description) body.description = formData.description.trim();

    // Price
    if (formData.priceType === 'on-request') {
      body.priceOnRequest = true;
    } else {
      if (formData.price) body.price = parseFloat(formData.price);
      if (formData.priceType === 'negotiable') body.priceNegotiable = true;
    }
    body.priceCurrency = 'EUR';

    // Vehicle details (only send non-empty values)
    if (formData.year) body.year = parseInt(formData.year, 10);
    if (formData.mileageKm) body.mileageKm = parseInt(formData.mileageKm, 10);
    if (formData.operatingHours) body.operatingHours = parseInt(formData.operatingHours, 10);
    if (formData.fuelType) body.fuelType = formData.fuelType;
    if (formData.transmission) body.transmission = formData.transmission;
    if (formData.powerHp) body.powerHp = parseInt(formData.powerHp, 10);
    if (formData.powerKw) body.powerKw = parseInt(formData.powerKw, 10);
    if (formData.emissionClass) body.emissionClass = formData.emissionClass;
    if (formData.bodyType) body.bodyType = formData.bodyType;
    if (formData.driveConfiguration) body.driveConfiguration = formData.driveConfiguration;
    if (formData.numberOfDoors) body.numberOfDoors = parseInt(formData.numberOfDoors, 10);
    if (formData.numberOfSeats) body.numberOfSeats = parseInt(formData.numberOfSeats, 10);
    if (formData.axleCount) body.axleCount = parseInt(formData.axleCount, 10);
    if (formData.cabType) body.cabType = formData.cabType;
    if (formData.gvwKg) body.gvwKg = parseInt(formData.gvwKg, 10);
    if (formData.payloadKg) body.payloadKg = parseInt(formData.payloadKg, 10);
    if (formData.wheelbaseMm) body.wheelbaseMm = parseInt(formData.wheelbaseMm, 10);
    if (formData.suspensionType) body.suspensionType = formData.suspensionType;
    if (formData.containerSize) body.containerSize = formData.containerSize;
    if (formData.containerType) body.containerType = formData.containerType;
    if (formData.color) body.color = formData.color;
    if (formData.vin) body.vin = formData.vin.trim();

    // Location
    if (formData.countryCode) body.countryCode = formData.countryCode;
    if (formData.city) body.city = formData.city.trim();

    // Contact
    if (formData.contactPhone) body.contactPhone = formData.contactPhone.trim();
    if (formData.contactEmail) body.contactEmail = formData.contactEmail.trim();
    if (formData.contactWhatsapp) body.contactWhatsapp = formData.contactWhatsapp.trim();

    return body;
  }, [formData, getCategoryId]);

  // ── Upload images for a listing ──
  const uploadImages = async (listingId: string) => {
    if (formData.images.length === 0) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    // Upload in batches of 10
    for (let i = 0; i < formData.images.length; i += 10) {
      const batch = formData.images.slice(i, i + 10);
      const fd = new window.FormData();
      batch.forEach((file) => fd.append('images', file));

      await fetch(`${baseUrl}/seller/listings/${listingId}/images`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
    }
  };

  // ── Submit listing ──
  const handleSubmit = async () => {
    const body = buildApiBody();
    if (!body) {
      toast.error('Could not resolve category. Please go back and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post<any>('/seller/listings', body);
      if (!res?.success) {
        toast.error(res?.message || 'Failed to create listing');
        return;
      }

      const listingId = res.data?.id;
      if (listingId && formData.images.length > 0) {
        toast.loading('Uploading images...', { id: 'img-upload' });
        await uploadImages(listingId);
        toast.dismiss('img-upload');
      }

      toast.success('Listing created successfully!');
      router.push('/seller/listings');
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Save as Draft (same as submit — status defaults to DRAFT on backend) ──
  const handleSaveDraft = async () => {
    const body = buildApiBody();
    if (!body) {
      toast.error('Please select a category and fill in the title first.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.post<any>('/seller/listings', body);
      if (res?.success) {
        const listingId = res.data?.id;
        if (listingId && formData.images.length > 0) {
          await uploadImages(listingId);
        }
        toast.success('Saved as draft!');
        router.push('/seller/listings');
      } else {
        toast.error(res?.message || 'Failed to save draft');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered brands for search
  const filteredBrands = brandSearch
    ? brands.filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands;

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════ */

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create New Listing</h1>
        <p className="text-muted-foreground mt-1">
          Step {step} of {TOTAL_STEPS}: {stepNames[step - 1]}
        </p>
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

          {/* ── Step 1: Category ── */}
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

          {/* ── Step 2: Basic Info ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>

              <Input
                id="title"
                label="Title *"
                placeholder="e.g., Mercedes-Benz Actros 2545 LS 6x2"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
              />

              {/* Brand Dropdown (searchable) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Brand</label>
                  {brandsLoading ? (
                    <div className="flex items-center gap-2 h-10 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading brands...
                    </div>
                  ) : (
                    <>
                      {brands.length > 10 && (
                        <div className="relative mb-1.5">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search brands..."
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                            className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-white text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>
                      )}
                      <select
                        value={formData.brandId}
                        onChange={(e) => {
                          const brand = brands.find((b) => b.id === e.target.value);
                          updateField('brandId', e.target.value);
                          updateField('brandName', brand?.name || '');
                        }}
                        className={selectClass}
                      >
                        <option value="">Select brand...</option>
                        {filteredBrands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} {b.listingCount > 0 ? `(${b.listingCount})` : ''}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                {/* Model Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Model</label>
                  {modelsLoading ? (
                    <div className="flex items-center gap-2 h-10 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading models...
                    </div>
                  ) : formData.brandId ? (
                    <select
                      value={formData.modelId}
                      onChange={(e) => {
                        const model = models.find((m) => m.id === e.target.value);
                        updateField('modelId', e.target.value);
                        updateField('modelName', model?.name || '');
                      }}
                      className={selectClass}
                    >
                      <option value="">Select model...</option>
                      {models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.listingCount > 0 ? `(${m.listingCount})` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select disabled className={cn(selectClass, 'opacity-50 cursor-not-allowed')}>
                      <option>Select a brand first</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Condition *</label>
                <div className="flex flex-wrap gap-3">
                  {conditionOptions.map((cond) => (
                    <button
                      key={cond.value}
                      onClick={() => updateField('condition', cond.value)}
                      className={cn(
                        'px-6 py-2.5 rounded-lg border-2 text-sm font-medium transition-all',
                        formData.condition === cond.value
                          ? 'border-accent bg-accent/5 text-accent'
                          : 'border-border text-foreground hover:border-primary/30'
                      )}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="price"
                  type="number"
                  label="Price (EUR)"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => updateField('price', e.target.value)}
                />
                <FormSelect
                  label="Price Type"
                  value={formData.priceType}
                  onChange={(v) => updateField('priceType', v)}
                  options={[
                    { label: 'Fixed Price', value: 'fixed' },
                    { label: 'Negotiable', value: 'negotiable' },
                    { label: 'Price on Request', value: 'on-request' },
                  ]}
                />
              </div>
            </div>
          )}

          {/* ── Step 3: Vehicle Details (category-dependent) ── */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {formData.category === 'parts' ? 'Item Details' : 'Vehicle Details'}
              </h2>

              {formData.category === 'parts' ? (
                <p className="text-sm text-muted-foreground">
                  No additional vehicle specifications needed for parts. Click Next to continue.
                </p>
              ) : (
                <>
                  {/* Row 0: Body Type */}
                  {showField('bodyType') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormSelect
                        label="Body Type"
                        value={formData.bodyType}
                        onChange={(v) => updateField('bodyType', v)}
                        options={bodyTypeOptions[formData.category] || []}
                        placeholder="Select body type..."
                      />
                    </div>
                  )}

                  {/* Row 1: Year + Mileage/Operating Hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {showField('year') && (
                      <Input
                        id="year"
                        type="number"
                        label="Year of Manufacture *"
                        placeholder="e.g., 2022"
                        value={formData.year}
                        onChange={(e) => updateField('year', e.target.value)}
                      />
                    )}
                    {showField('mileageKm') && (
                      <Input
                        id="mileageKm"
                        type="number"
                        label="Mileage (km)"
                        placeholder="e.g., 185000"
                        value={formData.mileageKm}
                        onChange={(e) => updateField('mileageKm', e.target.value)}
                      />
                    )}
                    {showField('operatingHours') && (
                      <Input
                        id="operatingHours"
                        type="number"
                        label="Operating Hours"
                        placeholder="e.g., 5400"
                        value={formData.operatingHours}
                        onChange={(e) => updateField('operatingHours', e.target.value)}
                      />
                    )}
                  </div>

                  {/* Row 2: Fuel Type + Transmission */}
                  {(showField('fuelType') || showField('transmission')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('fuelType') && (
                        <FormSelect
                          label="Fuel Type"
                          value={formData.fuelType}
                          onChange={(v) => updateField('fuelType', v)}
                          options={fuelOptions}
                        />
                      )}
                      {showField('transmission') && (
                        <FormSelect
                          label="Transmission"
                          value={formData.transmission}
                          onChange={(v) => updateField('transmission', v)}
                          options={transmissionOptions}
                        />
                      )}
                    </div>
                  )}

                  {/* Row 3: Power HP + kW */}
                  {(showField('powerHp') || showField('powerKw')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('powerHp') && (
                        <Input
                          id="powerHp"
                          type="number"
                          label="Power (HP)"
                          placeholder="e.g., 449"
                          value={formData.powerHp}
                          onChange={(e) => updateField('powerHp', e.target.value)}
                        />
                      )}
                      {showField('powerKw') && (
                        <Input
                          id="powerKw"
                          type="number"
                          label="Power (kW)"
                          placeholder="Auto-calculated from HP"
                          value={formData.powerKw}
                          onChange={(e) => updateField('powerKw', e.target.value)}
                        />
                      )}
                    </div>
                  )}

                  {/* Row 4: Emission Class + Axle Count */}
                  {(showField('emissionClass') || showField('axleCount')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('emissionClass') && (
                        <FormSelect
                          label="Emission Class"
                          value={formData.emissionClass}
                          onChange={(v) => updateField('emissionClass', v)}
                          options={emissionOptions}
                        />
                      )}
                      {showField('axleCount') && (
                        <FormSelect
                          label="Axle Count"
                          value={formData.axleCount}
                          onChange={(v) => updateField('axleCount', v)}
                          options={axleOptions}
                        />
                      )}
                    </div>
                  )}

                  {/* Row 4b: Drive Configuration */}
                  {showField('driveConfiguration') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormSelect
                        label="Drive Configuration"
                        value={formData.driveConfiguration}
                        onChange={(v) => updateField('driveConfiguration', v)}
                        options={['trucks'].includes(formData.category) ? truckDriveOptions : carDriveOptions}
                        placeholder="Select drive..."
                      />
                    </div>
                  )}

                  {/* Row 4c: Doors + Seats (cars/vans) */}
                  {(showField('numberOfDoors') || showField('numberOfSeats')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('numberOfDoors') && (
                        <FormSelect
                          label="Number of Doors"
                          value={formData.numberOfDoors}
                          onChange={(v) => updateField('numberOfDoors', v)}
                          options={doorsOptions}
                          placeholder="Select..."
                        />
                      )}
                      {showField('numberOfSeats') && (
                        <FormSelect
                          label="Number of Seats"
                          value={formData.numberOfSeats}
                          onChange={(v) => updateField('numberOfSeats', v)}
                          options={seatsOptions}
                          placeholder="Select..."
                        />
                      )}
                    </div>
                  )}

                  {/* Row 5: Cab Type + Suspension */}
                  {(showField('cabType') || showField('suspensionType')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('cabType') && (
                        <FormSelect
                          label="Cab Type"
                          value={formData.cabType}
                          onChange={(v) => updateField('cabType', v)}
                          options={cabTypeOptions}
                        />
                      )}
                      {showField('suspensionType') && (
                        <FormSelect
                          label="Suspension Type"
                          value={formData.suspensionType}
                          onChange={(v) => updateField('suspensionType', v)}
                          options={suspensionOptions}
                        />
                      )}
                    </div>
                  )}

                  {/* Row 6: GVW + Payload */}
                  {(showField('gvwKg') || showField('payloadKg')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('gvwKg') && (
                        <Input
                          id="gvwKg"
                          type="number"
                          label="Gross Vehicle Weight (kg)"
                          placeholder="e.g., 18000"
                          value={formData.gvwKg}
                          onChange={(e) => updateField('gvwKg', e.target.value)}
                        />
                      )}
                      {showField('payloadKg') && (
                        <Input
                          id="payloadKg"
                          type="number"
                          label="Payload Capacity (kg)"
                          placeholder="e.g., 12000"
                          value={formData.payloadKg}
                          onChange={(e) => updateField('payloadKg', e.target.value)}
                        />
                      )}
                    </div>
                  )}

                  {/* Row 7: Wheelbase */}
                  {showField('wheelbaseMm') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="wheelbaseMm"
                        type="number"
                        label="Wheelbase (mm)"
                        placeholder="e.g., 3900"
                        value={formData.wheelbaseMm}
                        onChange={(e) => updateField('wheelbaseMm', e.target.value)}
                      />
                    </div>
                  )}

                  {/* Container-specific fields */}
                  {(showField('containerSize') || showField('containerType')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('containerSize') && (
                        <FormSelect
                          label="Container Size"
                          value={formData.containerSize}
                          onChange={(v) => updateField('containerSize', v)}
                          options={containerSizeOptions}
                        />
                      )}
                      {showField('containerType') && (
                        <FormSelect
                          label="Container Type"
                          value={formData.containerType}
                          onChange={(v) => updateField('containerType', v)}
                          options={containerTypeOptions}
                        />
                      )}
                    </div>
                  )}

                  {/* Row: Color + VIN */}
                  {(showField('color') || showField('vin')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {showField('color') && (
                        <FormSelect
                          label="Color"
                          value={formData.color}
                          onChange={(v) => updateField('color', v)}
                          options={colorOptions.map((c) => ({ label: c, value: c }))}
                        />
                      )}
                      {showField('vin') && (
                        <Input
                          id="vin"
                          label="VIN (Vehicle Identification Number)"
                          placeholder="e.g., WDB96340310123456"
                          value={formData.vin}
                          onChange={(e) => updateField('vin', e.target.value)}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Step 4: Description ── */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
              <p className="text-sm text-muted-foreground">
                Provide a detailed description. Include key features, service history,
                and any other information buyers should know. Minimum 50 characters.
              </p>
              <Textarea
                id="description"
                placeholder="Describe your vehicle in detail..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={10}
                showCharCount
                maxLength={5000}
              />
              {formData.description.length > 0 && formData.description.length < 50 && (
                <p className="text-xs text-destructive">
                  Minimum 50 characters required ({50 - formData.description.length} more needed)
                </p>
              )}
            </div>
          )}

          {/* ── Step 5: Images ── */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Images</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Upload up to 20 images. The first image will be the main photo.
              </p>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
                  dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-primary/30'
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => { handleFileSelect(e.target.files); e.target.value = ''; }}
                />
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Drag & drop images here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or WebP. Max 10MB each. {formData.images.length}/20 uploaded.
                </p>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {formData.images.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <Badge className="absolute top-1 left-1 bg-accent text-white text-[9px] border-0 px-1.5 py-0">
                          Main
                        </Badge>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 6: Location & Contact ── */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Location & Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Country"
                  value={formData.countryCode}
                  onChange={(v) => updateField('countryCode', v)}
                  options={countryOptions}
                  placeholder="Select country..."
                  required
                />
                <Input
                  id="city"
                  label="City *"
                  placeholder="e.g., Rotterdam"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="contactPhone"
                  label="Contact Phone"
                  placeholder="+31 10 123 4567"
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                />
                <Input
                  id="contactEmail"
                  type="email"
                  label="Contact Email"
                  placeholder="info@company.com"
                  value={formData.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="contactWhatsapp"
                  label="WhatsApp Number"
                  placeholder="+31 6 1234 5678"
                  value={formData.contactWhatsapp}
                  onChange={(e) => updateField('contactWhatsapp', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── Step 7: Review & Submit ── */}
          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Review Your Listing</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <ReviewRow label="Category" value={formData.category} />
                <ReviewRow label="Title" value={formData.title} />
                <ReviewRow label="Brand" value={formData.brandName || '-'} />
                <ReviewRow label="Model" value={formData.modelName || '-'} />
                <ReviewRow label="Condition" value={conditionOptions.find((c) => c.value === formData.condition)?.label || '-'} />
                <ReviewRow
                  label="Price"
                  value={
                    formData.priceType === 'on-request'
                      ? 'Price on request'
                      : formData.price
                        ? `EUR ${Number(formData.price).toLocaleString()}${formData.priceType === 'negotiable' ? ' (Negotiable)' : ''}`
                        : '-'
                  }
                />

                {/* Category-dependent review fields */}
                {showField('bodyType') && <ReviewRow label="Body Type" value={formData.bodyType || '-'} />}
                {showField('year') && <ReviewRow label="Year" value={formData.year || '-'} />}
                {showField('mileageKm') && <ReviewRow label="Mileage" value={formData.mileageKm ? `${Number(formData.mileageKm).toLocaleString()} km` : '-'} />}
                {showField('operatingHours') && <ReviewRow label="Operating Hours" value={formData.operatingHours ? `${Number(formData.operatingHours).toLocaleString()} hrs` : '-'} />}
                {showField('fuelType') && <ReviewRow label="Fuel Type" value={fuelOptions.find((f) => f.value === formData.fuelType)?.label || '-'} />}
                {showField('transmission') && <ReviewRow label="Transmission" value={transmissionOptions.find((t) => t.value === formData.transmission)?.label || '-'} />}
                {showField('powerHp') && <ReviewRow label="Power" value={formData.powerHp ? `${formData.powerHp} HP (${formData.powerKw} kW)` : '-'} />}
                {showField('emissionClass') && <ReviewRow label="Emission Class" value={emissionOptions.find((e) => e.value === formData.emissionClass)?.label || '-'} />}
                {showField('driveConfiguration') && <ReviewRow label="Drive Configuration" value={formData.driveConfiguration || '-'} />}
                {showField('numberOfDoors') && <ReviewRow label="Doors" value={formData.numberOfDoors || '-'} />}
                {showField('numberOfSeats') && <ReviewRow label="Seats" value={formData.numberOfSeats || '-'} />}
                {showField('axleCount') && <ReviewRow label="Axle Count" value={formData.axleCount || '-'} />}
                {showField('cabType') && <ReviewRow label="Cab Type" value={formData.cabType || '-'} />}
                {showField('gvwKg') && <ReviewRow label="GVW" value={formData.gvwKg ? `${Number(formData.gvwKg).toLocaleString()} kg` : '-'} />}
                {showField('payloadKg') && <ReviewRow label="Payload" value={formData.payloadKg ? `${Number(formData.payloadKg).toLocaleString()} kg` : '-'} />}
                {showField('wheelbaseMm') && <ReviewRow label="Wheelbase" value={formData.wheelbaseMm ? `${Number(formData.wheelbaseMm).toLocaleString()} mm` : '-'} />}
                {showField('suspensionType') && <ReviewRow label="Suspension" value={formData.suspensionType || '-'} />}
                {showField('containerSize') && <ReviewRow label="Container Size" value={containerSizeOptions.find((c) => c.value === formData.containerSize)?.label || '-'} />}
                {showField('containerType') && <ReviewRow label="Container Type" value={formData.containerType || '-'} />}
                {showField('color') && <ReviewRow label="Color" value={formData.color || '-'} />}
                {showField('vin') && <ReviewRow label="VIN" value={formData.vin || '-'} />}

                <ReviewRow label="Images" value={`${formData.images.length} uploaded`} />
                <ReviewRow label="Country" value={countryOptions.find((c) => c.value === formData.countryCode)?.label || '-'} />
                <ReviewRow label="City" value={formData.city || '-'} />
                {formData.contactPhone && <ReviewRow label="Phone" value={formData.contactPhone} />}
                {formData.contactEmail && <ReviewRow label="Email" value={formData.contactEmail} />}
                {formData.contactWhatsapp && <ReviewRow label="WhatsApp" value={formData.contactWhatsapp} />}
              </div>

              {formData.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3 whitespace-pre-line line-clamp-5">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {step >= 2 && (
            <Button variant="ghost" onClick={handleSaveDraft} disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-1.5" />
              Save as Draft
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button variant="accent" onClick={() => setStep(step + 1)} disabled={!canGoNext()}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="accent" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Submitting...</>
              ) : (
                <><Check className="w-4 h-4 mr-1.5" />Submit Listing</>
              )}
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
