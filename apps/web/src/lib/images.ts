// Central image mapping for MenonTrucks marketplace
// All images sourced from Unsplash (free for commercial use, no attribution required)

const UNSPLASH_BASE = 'https://images.unsplash.com';

function img(photoId: string, w = 800, h = 450): string {
  return `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

// ─── TRUCK IMAGES ───────────────────────────────────────────────────────────
// Mapped to specific brands/models for realistic appearance

export const TRUCK_IMAGES = {
  'mercedes-actros': [
    img('photo-1616432043562-3671ea2e5242'),     // White freight truck on road
    img('photo-1683010373894-98f5f1711766'),     // Semi truck on parking lot
    img('photo-1452864982845-a252432b5d73'),     // Blue semi truck
  ],
  'volvo-fh': [
    img('photo-1759763131646-f9dd08c8ebfe'),     // Yellow truck mountain road
    img('photo-1720811559337-c59b75acc4de'),     // Semi truck desert road
    img('photo-1592805144716-feeccccef5ac'),     // Red truck on road
  ],
  'scania-r': [
    img('photo-1656514981974-dd0762aad9f4'),     // Yellow Scania truck
    img('photo-1577075473292-5f62dfae5522'),     // Truck with six wheels
    img('photo-1720811559371-7b0ebd219127'),     // Row of semi trucks parked
  ],
  'man-tgx': [
    img('photo-1565730350847-293cbe3fa4a3'),     // Green semi truck close-up
    img('photo-1770910619830-cdd14b451ceb'),     // Man in front of semi truck
    img('photo-1629019896873-cc95f1a8845d'),     // Blue/brown freight truck
  ],
  'daf-xf': [
    img('photo-1578857371787-189d8b9eda84'),     // White/black freight truck
    img('photo-1716066749933-b517a86a1afd'),     // Yellow truck with crane
    img('photo-1452864982845-a252432b5d73'),     // Blue semi truck
  ],
  'iveco': [
    img('photo-1571989928541-674d0cf46c4a'),     // Red freight truck beside building
    img('photo-1683010373894-98f5f1711766'),     // Semi truck parking
    img('photo-1616432043562-3671ea2e5242'),     // White freight truck
  ],
  'renault': [
    img('photo-1629019896873-cc95f1a8845d'),     // Blue/brown freight truck
    img('photo-1578857371787-189d8b9eda84'),     // White/black freight truck
    img('photo-1720811559371-7b0ebd219127'),     // Row of semi trucks
  ],
};

// ─── TRAILER IMAGES ─────────────────────────────────────────────────────────

export const TRAILER_IMAGES = {
  'curtainsider': [
    img('photo-1724556271642-e9acaf03ac23'),     // Row of semi trucks/trailers
    img('photo-1616011224441-f652db413327'),     // Green truck with trailer
    img('photo-1492168732976-2676c584c675'),     // Aerial freight lot
  ],
  'reefer': [
    img('photo-1606964212858-c215029db704'),     // Cargo containers
    img('photo-1724556271642-e9acaf03ac23'),     // Semi trailers
    img('photo-1683010373894-98f5f1711766'),     // Truck parking lot
  ],
  'flatbed': [
    img('photo-1682980799090-c4c6342be01a'),     // Flatbed trailer
    img('photo-1616011224441-f652db413327'),     // Green truck trailer
    img('photo-1492168732976-2676c584c675'),     // Aerial lot
  ],
  'tanker': [
    img('photo-1708296964763-2112b796177f'),     // Tanker truck pulling trailer
    img('photo-1606964212858-c215029db704'),     // Cargo containers
    img('photo-1724556271642-e9acaf03ac23'),     // Trailers parked
  ],
};

// ─── CONSTRUCTION EQUIPMENT IMAGES ──────────────────────────────────────────

export const CONSTRUCTION_IMAGES = {
  'excavator': [
    img('photo-1503708928676-1cb796a0891e'),     // Yellow CAT excavator digging
    img('photo-1622082679766-c5912d9416eb'),     // Excavator on brown soil
    img('photo-1649807479468-40011b31ee09'),     // Excavator on hill
  ],
  'wheel-loader': [
    img('photo-1652396614059-22f29cda1565'),     // Large yellow wheel loader
    img('photo-1627451945663-5c1daa80cb20'),     // Yellow front loader
    img('photo-1603814744450-36f978490b11'),     // Heavy equipment
  ],
  'bulldozer': [
    img('photo-1691047489143-79b91c648c85'),     // Bulldozer on construction site
    img('photo-1690719465490-db2864ef85c1'),     // Bulldozer parked
    img('photo-1711618732595-0c517e08d40c'),     // Bulldozer rubble
  ],
  'grader': [
    img('photo-1605475723788-08c82657b6af'),     // Motor grader
    img('photo-1599756719094-9e28479389c4'),     // Heavy equipment mining
    img('photo-1505833464198-4993b36cdfab'),     // Equipment near hill
  ],
  'dump-truck': [
    img('photo-1599756719094-9e28479389c4'),     // Heavy equipment on sand
    img('photo-1503708928676-1cb796a0891e'),     // CAT excavator digging
    img('photo-1652396614059-22f29cda1565'),     // Large equipment
  ],
};

// ─── VAN IMAGES ─────────────────────────────────────────────────────────────

export const VAN_IMAGES = {
  'mercedes-sprinter': [
    img('photo-1535655685871-dc8158ff167e'),     // White Mercedes Sprinter
    img('photo-1574696081601-0f5370bbb8f3'),     // White panel van
    img('photo-1572034567373-21e393e167cb'),     // White panel van close
  ],
  'ford-transit': [
    img('photo-1621201216621-262db27f9f12'),     // Yellow/white Ford van
    img('photo-1614214078088-552265ecad41'),     // White/black Ford van
    img('photo-1570905375301-e33b61438107'),     // White panel van parked
  ],
  'vw-crafter': [
    img('photo-1574696081601-0f5370bbb8f3'),     // White panel van
    img('photo-1676847391332-5697224a69d4'),     // White van on snowy street
    img('photo-1535655685871-dc8158ff167e'),     // White Sprinter
  ],
  'iveco-daily': [
    img('photo-1760662052295-f84068499a03'),     // White delivery truck
    img('photo-1598317940377-d1e5402f1bed'),     // White/red van
    img('photo-1674935644316-cb0e60d877a0'),     // White van desert
  ],
  'renault-master': [
    img('photo-1639779247529-a2507ab50216'),     // White van with drawing
    img('photo-1570905375301-e33b61438107'),     // White panel van
    img('photo-1574696081601-0f5370bbb8f3'),     // White panel van
  ],
  'generic': [
    img('photo-1574696081601-0f5370bbb8f3'),     // White panel van
    img('photo-1535655685871-dc8158ff167e'),     // White Sprinter
    img('photo-1760662052295-f84068499a03'),     // White delivery
  ],
};

// ─── HELPER: Get images by listing title ────────────────────────────────────
// Matches listing title keywords to the most appropriate image set

export function getImagesForListing(title: string): string[] {
  const t = title.toLowerCase();

  // Trucks
  if (t.includes('actros') || (t.includes('mercedes') && !t.includes('sprinter')))
    return TRUCK_IMAGES['mercedes-actros'];
  if (t.includes('volvo fh') || t.includes('volvo fl') || t.includes('volvo fm'))
    return TRUCK_IMAGES['volvo-fh'];
  if (t.includes('scania'))
    return TRUCK_IMAGES['scania-r'];
  if (t.includes('man tg'))
    return TRUCK_IMAGES['man-tgx'];
  if (t.includes('daf'))
    return TRUCK_IMAGES['daf-xf'];
  if (t.includes('iveco') && !t.includes('daily'))
    return TRUCK_IMAGES['iveco'];
  if (t.includes('renault t') || t.includes('renault t480'))
    return TRUCK_IMAGES['renault'];

  // Trailers
  if (t.includes('curtain') || t.includes('profi liner') || t.includes('mega'))
    return TRAILER_IMAGES['curtainsider'];
  if (t.includes('reefer') || t.includes('cool liner') || t.includes('thermo'))
    return TRAILER_IMAGES['reefer'];
  if (t.includes('flatbed') || t.includes('lowbed') || t.includes('low loader'))
    return TRAILER_IMAGES['flatbed'];
  if (t.includes('tanker') || t.includes('container chassis'))
    return TRAILER_IMAGES['tanker'];
  if (t.includes('trailer') || t.includes('schmitz') || t.includes('krone') || t.includes('kögel'))
    return TRAILER_IMAGES['curtainsider'];

  // Construction
  if (t.includes('excavator') || t.includes('320') || t.includes('336') || t.includes('946'))
    return CONSTRUCTION_IMAGES['excavator'];
  if (t.includes('loader') || t.includes('950') || t.includes('l 566'))
    return CONSTRUCTION_IMAGES['wheel-loader'];
  if (t.includes('bulldozer') || t.includes('d6') || t.includes('tractor') && t.includes('track'))
    return CONSTRUCTION_IMAGES['bulldozer'];
  if (t.includes('grader') || t.includes('140m'))
    return CONSTRUCTION_IMAGES['grader'];
  if (t.includes('dump') || t.includes('745') || t.includes('caterpillar'))
    return CONSTRUCTION_IMAGES['dump-truck'];

  // Vans
  if (t.includes('sprinter'))
    return VAN_IMAGES['mercedes-sprinter'];
  if (t.includes('transit') || t.includes('ford'))
    return VAN_IMAGES['ford-transit'];
  if (t.includes('crafter') || t.includes('vw') || t.includes('volkswagen'))
    return VAN_IMAGES['vw-crafter'];
  if (t.includes('daily'))
    return VAN_IMAGES['iveco-daily'];
  if (t.includes('master') || (t.includes('renault') && !t.includes('t480')))
    return VAN_IMAGES['renault-master'];
  if (t.includes('boxer') || t.includes('peugeot') || t.includes('ducato') || t.includes('fiat'))
    return VAN_IMAGES['generic'];

  // Default: generic truck
  return TRUCK_IMAGES['mercedes-actros'];
}

// ─── Category hero images ───────────────────────────────────────────────────

export const CATEGORY_HERO_IMAGES = {
  trucks: img('photo-1616432043562-3671ea2e5242', 1200, 400),
  trailers: img('photo-1724556271642-e9acaf03ac23', 1200, 400),
  construction: img('photo-1503708928676-1cb796a0891e', 1200, 400),
  vans: img('photo-1535655685871-dc8158ff167e', 1200, 400),
};

// ─── Brand logos (text-based placeholder with icon) ─────────────────────────
// We use representative truck images for brand cards

export const BRAND_IMAGES: Record<string, string> = {
  'Mercedes-Benz': img('photo-1616432043562-3671ea2e5242', 300, 200),
  'Volvo': img('photo-1759763131646-f9dd08c8ebfe', 300, 200),
  'Scania': img('photo-1656514981974-dd0762aad9f4', 300, 200),
  'MAN': img('photo-1565730350847-293cbe3fa4a3', 300, 200),
  'DAF': img('photo-1578857371787-189d8b9eda84', 300, 200),
  'Caterpillar': img('photo-1503708928676-1cb796a0891e', 300, 200),
  'Iveco': img('photo-1571989928541-674d0cf46c4a', 300, 200),
  'Renault': img('photo-1629019896873-cc95f1a8845d', 300, 200),
};
