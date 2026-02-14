import type { Metadata } from 'next';

const categoryMeta: Record<string, { title: string; description: string }> = {
  trucks: {
    title: 'Trucks for Sale | New & Used Trucks',
    description: 'Find the best deals on trucks from verified dealers across Europe. Tractor units, box trucks, flatbeds, refrigerated trucks and more.',
  },
  trailers: {
    title: 'Trailers for Sale | Semi-Trailers & Flatbeds',
    description: 'Browse thousands of trailers including semi-trailers, flatbeds, refrigerated trailers and more from top European dealers.',
  },
  construction: {
    title: 'Construction Equipment for Sale | Excavators & Loaders',
    description: 'Excavators, loaders, cranes and all types of construction equipment from trusted dealers across Europe.',
  },
  vans: {
    title: 'Vans for Sale | Cargo & Delivery Vans',
    description: 'Find cargo vans, delivery vans, and commercial vans from top brands like Mercedes Sprinter, Ford Transit, VW Crafter.',
  },
  cars: {
    title: 'Cars for Sale | Commercial Vehicles',
    description: 'Browse commercial cars and vehicles from verified European dealers.',
  },
  containers: {
    title: 'Containers for Sale | Shipping & Storage',
    description: 'Find shipping containers, storage containers, and specialized containers from trusted sellers.',
  },
  parts: {
    title: 'Parts & Accessories | Truck & Trailer Parts',
    description: 'Shop for truck parts, trailer parts, and commercial vehicle accessories from European suppliers.',
  },
};

const defaultMeta = {
  title: 'Vehicles for Sale | Menon Mobility',
  description: 'Browse our wide selection of commercial vehicles and equipment on Menon Mobility.',
};

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const meta = categoryMeta[params.category] || defaultMeta;
  return {
    title: `${meta.title} | Menon Mobility`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Menon Mobility`,
      description: meta.description,
      type: 'website',
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
