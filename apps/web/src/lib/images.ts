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

// ─── CAR IMAGES ──────────────────────────────────────────────────────────────

export const CAR_IMAGES = {
  'bmw': [
    img('photo-1555215695-3004980ad54e'),     // Sports car on road
    img('photo-1542362567-b07e54358753'),     // BMW coupe
    img('photo-1580273916550-e323be2ae537'),  // White BMW sedan
  ],
  'audi': [
    '/cars-audi-1.jpg',                       // Blue Audi RS6 Avant
    '/cars-audi-2.jpg',                       // Blue Audi A5 Sportback
    img('photo-1617531653332-bd46c24f2068'),  // Audi A4
  ],
  'mercedes-car': [
    img('photo-1553440569-bcc63803a83d'),     // Modern sedan highway
    img('photo-1544636331-e26879cd4d9b'),     // Luxury sedan
    img('photo-1503376780353-7e6692767b70'),  // Premium car road
  ],
  'volkswagen-car': [
    img('photo-1494976388531-d1058494cdd8'),  // Sedan driving
    img('photo-1533473359331-0135ef1b58bf'),  // Compact SUV
    img('photo-1552519507-da3b142c6e3d'),     // Red car
  ],
  'toyota': [
    img('photo-1494976388531-d1058494cdd8'),  // Sedan driving
    img('photo-1533473359331-0135ef1b58bf'),  // SUV
    img('photo-1555215695-3004980ad54e'),     // Sporty car
  ],
  'generic-car': [
    img('photo-1494976388531-d1058494cdd8'),  // Car driving on road
    img('photo-1553440569-bcc63803a83d'),     // Modern sedan
    img('photo-1552519507-da3b142c6e3d'),     // Red car
  ],
};

// ─── CONTAINER IMAGES ────────────────────────────────────────────────────────

export const CONTAINER_IMAGES = {
  'shipping': [
    img('photo-1611117775350-ac3950990985'),  // Colorful shipping containers
    img('photo-1578575437130-527eed3abbec'),  // Container yard
    img('photo-1586528116311-ad8dd3c8310d'),  // Container port
  ],
  'storage': [
    img('photo-1601584115197-04ecc0da31d7'),  // Stacked containers
    img('photo-1611117775350-ac3950990985'),  // Container rows
    img('photo-1578575437130-527eed3abbec'),  // Container depot
  ],
  'reefer-container': [
    img('photo-1605745341112-85968b19335b'),  // Container dock
    img('photo-1586528116311-ad8dd3c8310d'),  // Port containers
    img('photo-1601584115197-04ecc0da31d7'),  // Stacked containers
  ],
  'tank-container': [
    img('photo-1510414842594-a61c69b5ae57'),  // Container ship
    img('photo-1605745341112-85968b19335b'),  // Port dock
    img('photo-1611117775350-ac3950990985'),  // Container yard
  ],
};

// ─── PARTS & ACCESSORIES IMAGES ──────────────────────────────────────────────

export const PARTS_IMAGES = {
  'engine': [
    img('photo-1486262715619-67b85e0b08d3'),  // Engine closeup
    img('photo-1558618666-fcd25c85f82e'),     // Engine bay
    img('photo-1580894894513-541e068a3e2b'),  // Mechanic working
  ],
  'brakes': [
    img('photo-1580894894513-541e068a3e2b'),  // Mechanic at work
    img('photo-1558618666-fcd25c85f82e'),     // Under the hood
    img('photo-1486262715619-67b85e0b08d3'),  // Engine parts
  ],
  'tyres': [
    img('photo-1619642751034-765dfdf7c58e'),  // Wheels and tyres
    img('photo-1621993202323-f438eec934ff'),  // Auto parts
    img('photo-1580894894513-541e068a3e2b'),  // Workshop
  ],
  'generic-parts': [
    img('photo-1621993202323-f438eec934ff'),  // Auto spare parts
    img('photo-1486262715619-67b85e0b08d3'),  // Engine closeup
    img('photo-1619642751034-765dfdf7c58e'),  // Wheels
  ],
};

// ─── HELPER: Get images by listing title ────────────────────────────────────
// Matches listing title keywords to the most appropriate image set

export function getImagesForListing(title: string): string[] {
  const t = title.toLowerCase();

  // ── Containers (check first — "reefer container" must not match trailer "reefer")
  if (t.includes('shipping container') || t.includes('20ft') || t.includes('40ft') || t.includes('20 ft') || t.includes('40 ft'))
    return CONTAINER_IMAGES['shipping'];
  if (t.includes('storage container'))
    return CONTAINER_IMAGES['storage'];
  if (t.includes('reefer container') || t.includes('refrigerated container'))
    return CONTAINER_IMAGES['reefer-container'];
  if (t.includes('tank container') || t.includes('iso tank'))
    return CONTAINER_IMAGES['tank-container'];
  if (t.includes('container') && !t.includes('chassis'))
    return CONTAINER_IMAGES['shipping'];

  // ── Parts & Accessories (check before trucks — "engine assembly" must not fall through)
  if (t.includes('engine') || t.includes('motor') || t.includes('turbo') || t.includes('gearbox'))
    return PARTS_IMAGES['engine'];
  if (t.includes('brake') || t.includes('caliper') || t.includes('disc') || t.includes('pad'))
    return PARTS_IMAGES['brakes'];
  if (t.includes('tyre') || t.includes('tire') || t.includes('wheel') || t.includes('rim'))
    return PARTS_IMAGES['tyres'];
  if (t.includes('filter') || t.includes('gasket') || t.includes('bearing') || t.includes('alternator'))
    return PARTS_IMAGES['generic-parts'];

  // ── Cars (check before trucks — "Mercedes E-Class" must not match truck "mercedes")
  if (t.includes('bmw') || t.includes('3 series') || t.includes('5 series') || t.includes('x5'))
    return CAR_IMAGES['bmw'];
  if (t.includes('audi') || t.includes('a4') || t.includes('a6') || t.includes('q7'))
    return CAR_IMAGES['audi'];
  if (t.includes('c-class') || t.includes('e-class') || t.includes('s-class') || t.includes('gle') || t.includes('glc'))
    return CAR_IMAGES['mercedes-car'];
  if (t.includes('golf') || t.includes('passat') || t.includes('tiguan') || t.includes('polo'))
    return CAR_IMAGES['volkswagen-car'];
  if (t.includes('toyota') || t.includes('corolla') || t.includes('hilux') || t.includes('land cruiser'))
    return CAR_IMAGES['toyota'];

  // ── Trucks
  if (t.includes('actros') || t.includes('atego') || t.includes('arocs') || t.includes('axor'))
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

  // ── Trailers
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

  // ── Construction
  if (t.includes('excavator') || t.includes('cat 320') || t.includes('pc210') || t.includes('ec220'))
    return CONSTRUCTION_IMAGES['excavator'];
  if (t.includes('loader') || t.includes('l 566') || t.includes('950'))
    return CONSTRUCTION_IMAGES['wheel-loader'];
  if (t.includes('bulldozer') || t.includes('d6'))
    return CONSTRUCTION_IMAGES['bulldozer'];
  if (t.includes('grader') || t.includes('140m'))
    return CONSTRUCTION_IMAGES['grader'];
  if (t.includes('dump') || t.includes('745') || t.includes('caterpillar'))
    return CONSTRUCTION_IMAGES['dump-truck'];

  // ── Vans
  if (t.includes('sprinter'))
    return VAN_IMAGES['mercedes-sprinter'];
  if (t.includes('transit') || t.includes('ford'))
    return VAN_IMAGES['ford-transit'];
  if (t.includes('crafter') || t.includes('transporter') || t.includes('caddy'))
    return VAN_IMAGES['vw-crafter'];
  if (t.includes('daily'))
    return VAN_IMAGES['iveco-daily'];
  if (t.includes('master') || (t.includes('renault') && !t.includes('t480')))
    return VAN_IMAGES['renault-master'];
  if (t.includes('boxer') || t.includes('peugeot') || t.includes('ducato') || t.includes('fiat'))
    return VAN_IMAGES['generic'];

  // ── Fallback: generic Mercedes or VW → car images
  if (t.includes('mercedes'))
    return CAR_IMAGES['mercedes-car'];
  if (t.includes('vw') || t.includes('volkswagen'))
    return CAR_IMAGES['volkswagen-car'];

  // Default: generic truck
  return TRUCK_IMAGES['mercedes-actros'];
}

// ─── Category hero images ───────────────────────────────────────────────────

export const CATEGORY_HERO_IMAGES = {
  trucks: img('photo-1616432043562-3671ea2e5242', 1920, 600),
  trailers: img('photo-1724556271642-e9acaf03ac23', 1920, 600),
  construction: img('photo-1503708928676-1cb796a0891e', 1920, 600),
  vans: img('photo-1535655685871-dc8158ff167e', 1920, 600),
  cars: img('photo-1494976388531-d1058494cdd8', 1920, 600),
  containers: img('photo-1611117775350-ac3950990985', 1920, 600),
  parts: img('photo-1621993202323-f438eec934ff', 1920, 600),
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
