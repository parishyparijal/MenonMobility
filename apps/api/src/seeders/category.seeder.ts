import prisma from "@/config/database";

// ---------------------------------------------------------------------------
// Category Seeder — 44+ categories in a hierarchical tree
// ---------------------------------------------------------------------------

interface CategorySeed {
  name: { en: string; nl: string; de: string };
  slug: string;
  icon: string;
  description: { en: string; nl: string; de: string };
  sortOrder: number;
  children?: CategorySeed[];
}

const CATEGORY_TREE: CategorySeed[] = [
  // ─── TRANSPORT ────────────────────────────────────────────────
  {
    name: { en: "Trucks", nl: "Vrachtwagens", de: "Lastwagen" },
    slug: "trucks",
    icon: "truck",
    description: {
      en: "All types of commercial trucks for transport and logistics",
      nl: "Alle soorten bedrijfsvrachtwagens voor transport en logistiek",
      de: "Alle Arten von Nutzfahrzeugen für Transport und Logistik",
    },
    sortOrder: 1,
    children: [
      {
        name: { en: "Tractor Units", nl: "Trekkers", de: "Sattelzugmaschinen" },
        slug: "tractor-units",
        icon: "truck-front",
        description: {
          en: "Semi-truck tractor units for pulling trailers",
          nl: "Trekkers voor het trekken van opleggers",
          de: "Sattelzugmaschinen zum Ziehen von Aufliegern",
        },
        sortOrder: 1,
      },
      {
        name: { en: "Box Trucks", nl: "Bakwagens", de: "Koffer-LKW" },
        slug: "box-trucks",
        icon: "package",
        description: {
          en: "Enclosed box body trucks for cargo transport",
          nl: "Gesloten bakwagens voor vrachtvervoer",
          de: "Geschlossene Koffer-LKW für Frachttransport",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Flatbed Trucks", nl: "Platte Vrachtwagens", de: "Pritschenwagen" },
        slug: "flatbed-trucks",
        icon: "layout",
        description: {
          en: "Open flatbed trucks for oversized and heavy loads",
          nl: "Open platte vrachtwagens voor grote en zware ladingen",
          de: "Offene Pritschenwagen für übergroße und schwere Lasten",
        },
        sortOrder: 3,
      },
      {
        name: { en: "Tipper Trucks", nl: "Kiepwagens", de: "Kipper" },
        slug: "tipper-trucks",
        icon: "arrow-up-right",
        description: {
          en: "Dump trucks and tippers for construction and mining",
          nl: "Kiepwagens voor bouw en mijnbouw",
          de: "Kipper für Bau und Bergbau",
        },
        sortOrder: 4,
      },
      {
        name: { en: "Refrigerated Trucks", nl: "Koelwagens", de: "Kühl-LKW" },
        slug: "refrigerated-trucks",
        icon: "thermometer-snowflake",
        description: {
          en: "Temperature-controlled trucks for perishable goods",
          nl: "Temperatuurgecontroleerde vrachtwagens voor bederfelijke goederen",
          de: "Temperaturgeführte LKW für verderbliche Waren",
        },
        sortOrder: 5,
      },
      {
        name: { en: "Crane Trucks", nl: "Kraanwagens", de: "Kranwagen" },
        slug: "crane-trucks",
        icon: "crane",
        description: {
          en: "Trucks equipped with mounted cranes for loading and lifting",
          nl: "Vrachtwagens met gemonteerde kranen voor laden en hijsen",
          de: "LKW mit montierten Kränen zum Laden und Heben",
        },
        sortOrder: 6,
      },
      {
        name: { en: "Tank Trucks", nl: "Tankwagens", de: "Tankwagen" },
        slug: "tank-trucks",
        icon: "droplet",
        description: {
          en: "Tanker trucks for liquid and gas transport",
          nl: "Tankwagens voor vloeistof- en gastransport",
          de: "Tankwagen für Flüssigkeits- und Gastransport",
        },
        sortOrder: 7,
      },
      {
        name: { en: "Fire Trucks", nl: "Brandweerwagens", de: "Feuerwehrfahrzeuge" },
        slug: "fire-trucks",
        icon: "flame",
        description: {
          en: "Fire fighting and emergency response vehicles",
          nl: "Brandweer- en hulpverleningsvoertuigen",
          de: "Feuerwehr- und Rettungsfahrzeuge",
        },
        sortOrder: 8,
      },
      {
        name: { en: "Garbage Trucks", nl: "Vuilniswagens", de: "Müllwagen" },
        slug: "garbage-trucks",
        icon: "trash-2",
        description: {
          en: "Waste collection and refuse vehicles",
          nl: "Afvalinzameling en vuilnisvoertuigen",
          de: "Abfallsammelfahrzeuge und Müllfahrzeuge",
        },
        sortOrder: 9,
      },
      {
        name: { en: "Curtainsider Trucks", nl: "Schuifzeilwagens", de: "Schiebeplanenwagen" },
        slug: "curtainsider-trucks",
        icon: "columns",
        description: {
          en: "Trucks with sliding curtain sides for easy loading",
          nl: "Vrachtwagens met schuifzeilen voor eenvoudig laden",
          de: "LKW mit Schiebeplanen für einfaches Beladen",
        },
        sortOrder: 10,
      },
      {
        name: { en: "Other Trucks", nl: "Overige Vrachtwagens", de: "Sonstige LKW" },
        slug: "other-trucks",
        icon: "more-horizontal",
        description: {
          en: "Other specialized truck types",
          nl: "Overige gespecialiseerde vrachtwagentypen",
          de: "Sonstige spezialisierte LKW-Typen",
        },
        sortOrder: 11,
      },
    ],
  },
  {
    name: { en: "Trailers", nl: "Opleggers", de: "Auflieger" },
    slug: "trailers",
    icon: "container",
    description: {
      en: "Semi-trailers and full trailers for all transport needs",
      nl: "Opleggers en aanhangwagens voor alle transportbehoeften",
      de: "Auflieger und Anhänger für alle Transportbedürfnisse",
    },
    sortOrder: 2,
    children: [
      {
        name: { en: "Semi Trailers", nl: "Opleggers", de: "Sattelauflieger" },
        slug: "semi-trailers",
        icon: "truck-trailer",
        description: {
          en: "Standard semi-trailers for general cargo",
          nl: "Standaard opleggers voor algemene lading",
          de: "Standard-Sattelauflieger für allgemeine Fracht",
        },
        sortOrder: 1,
      },
      {
        name: { en: "Curtainsider Trailers", nl: "Schuifzeilopleggers", de: "Schiebeplanenauflieger" },
        slug: "curtainsider-trailers",
        icon: "columns",
        description: {
          en: "Trailers with sliding curtain sides",
          nl: "Opleggers met schuifzeilen",
          de: "Auflieger mit Schiebeplanen",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Flatbed Trailers", nl: "Platte Opleggers", de: "Pritschenauflieger" },
        slug: "flatbed-trailers",
        icon: "layout",
        description: {
          en: "Open flatbed trailers for heavy and oversized loads",
          nl: "Open platte opleggers voor zware en overmaatse ladingen",
          de: "Offene Pritschenauflieger für schwere und übergroße Lasten",
        },
        sortOrder: 3,
      },
      {
        name: { en: "Refrigerated Trailers", nl: "Koelopleggers", de: "Kühlauflieger" },
        slug: "refrigerated-trailers",
        icon: "thermometer-snowflake",
        description: {
          en: "Temperature-controlled trailers for perishable goods",
          nl: "Temperatuurgecontroleerde opleggers voor bederfelijke goederen",
          de: "Temperaturgeführte Auflieger für verderbliche Waren",
        },
        sortOrder: 4,
      },
      {
        name: { en: "Tank Trailers", nl: "Tankopleggers", de: "Tankauflieger" },
        slug: "tank-trailers",
        icon: "droplet",
        description: {
          en: "Tanker trailers for liquid and gas transport",
          nl: "Tankopleggers voor vloeistof- en gastransport",
          de: "Tankauflieger für Flüssigkeits- und Gastransport",
        },
        sortOrder: 5,
      },
      {
        name: { en: "Tipper Trailers", nl: "Kiepopleggers", de: "Kippauflieger" },
        slug: "tipper-trailers",
        icon: "arrow-up-right",
        description: {
          en: "Tipper trailers for bulk materials",
          nl: "Kiepopleggers voor bulkmaterialen",
          de: "Kippauflieger für Schüttgüter",
        },
        sortOrder: 6,
      },
      {
        name: { en: "Container Chassis", nl: "Containerchassis", de: "Containerchassis" },
        slug: "container-chassis",
        icon: "box",
        description: {
          en: "Container chassis for intermodal transport",
          nl: "Containerchassis voor intermodaal transport",
          de: "Containerchassis für intermodalen Transport",
        },
        sortOrder: 7,
      },
      {
        name: { en: "Lowboy Trailers", nl: "Diepladers", de: "Tieflader" },
        slug: "lowboy-trailers",
        icon: "arrow-down",
        description: {
          en: "Low-bed trailers for heavy machinery transport",
          nl: "Diepladers voor zwaar machinetransport",
          de: "Tieflader für Schwermaschinentransport",
        },
        sortOrder: 8,
      },
      {
        name: { en: "Walking Floor", nl: "Walking Floor", de: "Schubboden" },
        slug: "walking-floor",
        icon: "move-horizontal",
        description: {
          en: "Walking floor trailers for bulk and waste materials",
          nl: "Walking floor opleggers voor bulk- en afvalmaterialen",
          de: "Schubbodenauflieger für Schütt- und Abfallmaterialien",
        },
        sortOrder: 9,
      },
      {
        name: { en: "Other Trailers", nl: "Overige Opleggers", de: "Sonstige Auflieger" },
        slug: "other-trailers",
        icon: "more-horizontal",
        description: {
          en: "Other specialized trailer types",
          nl: "Overige gespecialiseerde opleggertypen",
          de: "Sonstige spezialisierte Auflieger-Typen",
        },
        sortOrder: 10,
      },
    ],
  },
  {
    name: { en: "Full Trailers", nl: "Aanhangwagens", de: "Anhänger" },
    slug: "full-trailers",
    icon: "link",
    description: {
      en: "Full trailers and drawbar trailers",
      nl: "Aanhangwagens en dissel-aanhangwagens",
      de: "Anhänger und Deichselanhänger",
    },
    sortOrder: 3,
  },

  // ─── EQUIPMENT ────────────────────────────────────────────────
  {
    name: { en: "Construction Machinery", nl: "Bouwmachines", de: "Baumaschinen" },
    slug: "construction-machinery",
    icon: "hard-hat",
    description: {
      en: "Heavy construction equipment and machinery",
      nl: "Zware bouwmachines en apparatuur",
      de: "Schwere Baumaschinen und Geräte",
    },
    sortOrder: 4,
    children: [
      {
        name: { en: "Excavators", nl: "Graafmachines", de: "Bagger" },
        slug: "excavators",
        icon: "shovel",
        description: {
          en: "Tracked and wheeled excavators",
          nl: "Rups- en wielbaggers",
          de: "Raupen- und Radbagger",
        },
        sortOrder: 1,
      },
      {
        name: { en: "Wheel Loaders", nl: "Wielladers", de: "Radlader" },
        slug: "wheel-loaders",
        icon: "loader",
        description: {
          en: "Front-end wheel loaders for material handling",
          nl: "Wielladers voor materiaalbehandeling",
          de: "Radlader für Materialumschlag",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Bulldozers", nl: "Bulldozers", de: "Bulldozer" },
        slug: "bulldozers",
        icon: "rectangle-horizontal",
        description: {
          en: "Crawler bulldozers for earthmoving",
          nl: "Rupsbulldozers voor grondverzet",
          de: "Raupenbulldozer für Erdbewegung",
        },
        sortOrder: 3,
      },
      {
        name: { en: "Cranes", nl: "Kranen", de: "Kräne" },
        slug: "cranes",
        icon: "crane",
        description: {
          en: "Mobile cranes, tower cranes and crawler cranes",
          nl: "Mobiele kranen, torenkranen en rupskranen",
          de: "Mobilkrane, Turmdrehkrane und Raupenkrane",
        },
        sortOrder: 4,
      },
      {
        name: { en: "Concrete Mixers", nl: "Betonmixers", de: "Betonmischer" },
        slug: "concrete-mixers",
        icon: "rotate-cw",
        description: {
          en: "Concrete mixer trucks and stationary mixers",
          nl: "Betonmixers en stationair mengsels",
          de: "Betonmisch-LKW und stationäre Mischer",
        },
        sortOrder: 5,
      },
      {
        name: { en: "Compactors", nl: "Verdichtingsmachines", de: "Verdichter" },
        slug: "compactors",
        icon: "minimize-2",
        description: {
          en: "Road rollers and soil compactors",
          nl: "Wegwalsen en bodemverdichters",
          de: "Straßenwalzen und Bodenverdichter",
        },
        sortOrder: 6,
      },
      {
        name: { en: "Other Construction", nl: "Overige Bouwmachines", de: "Sonstige Baumaschinen" },
        slug: "other-construction",
        icon: "more-horizontal",
        description: {
          en: "Other construction equipment and machinery",
          nl: "Overige bouwmachines en apparatuur",
          de: "Sonstige Baumaschinen und Geräte",
        },
        sortOrder: 7,
      },
    ],
  },
  {
    name: { en: "Agricultural Machinery", nl: "Landbouwmachines", de: "Landmaschinen" },
    slug: "agricultural-machinery",
    icon: "wheat",
    description: {
      en: "Farm equipment and agricultural machinery",
      nl: "Landbouwmachines en agrarische apparatuur",
      de: "Landwirtschaftliche Maschinen und Geräte",
    },
    sortOrder: 5,
    children: [
      {
        name: { en: "Tractors", nl: "Tractoren", de: "Traktoren" },
        slug: "tractors",
        icon: "tractor",
        description: {
          en: "Agricultural tractors for farming operations",
          nl: "Landbouwtractoren voor agrarische werkzaamheden",
          de: "Landwirtschaftliche Traktoren für Farmbetrieb",
        },
        sortOrder: 1,
      },
      {
        name: { en: "Harvesters", nl: "Oogstmachines", de: "Mähdrescher" },
        slug: "harvesters",
        icon: "scissors",
        description: {
          en: "Combine harvesters and forage harvesters",
          nl: "Maaidorsers en hakselaars",
          de: "Mähdrescher und Feldhäcksler",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Sprayers", nl: "Spuitmachines", de: "Sprühgeräte" },
        slug: "sprayers",
        icon: "spray-can",
        description: {
          en: "Crop sprayers and fertilizer spreaders",
          nl: "Veldspuiten en kunstmeststrooiers",
          de: "Feldspritzen und Düngerstreuer",
        },
        sortOrder: 3,
      },
      {
        name: { en: "Other Agricultural", nl: "Overige Landbouw", de: "Sonstige Landmaschinen" },
        slug: "other-agricultural",
        icon: "more-horizontal",
        description: {
          en: "Other agricultural equipment",
          nl: "Overige landbouwmachines",
          de: "Sonstige landwirtschaftliche Geräte",
        },
        sortOrder: 4,
      },
    ],
  },
  {
    name: { en: "Material Handling", nl: "Intern Transport", de: "Flurförderzeuge" },
    slug: "material-handling",
    icon: "forklift",
    description: {
      en: "Forklifts, reach stackers and material handling equipment",
      nl: "Vorkheftrucks, reachstackers en intern transportmaterieel",
      de: "Gabelstapler, Reachstacker und Flurförderzeuge",
    },
    sortOrder: 6,
    children: [
      {
        name: { en: "Forklifts", nl: "Vorkheftrucks", de: "Gabelstapler" },
        slug: "forklifts",
        icon: "forklift",
        description: {
          en: "Counterbalance and warehouse forklifts",
          nl: "Contragewicht- en magazijnheftrucks",
          de: "Gegengewichts- und Lagerstapler",
        },
        sortOrder: 1,
      },
      {
        name: { en: "Reach Stackers", nl: "Reachstackers", de: "Reachstacker" },
        slug: "reach-stackers",
        icon: "move-vertical",
        description: {
          en: "Container reach stackers for port and terminal operations",
          nl: "Container reachstackers voor haven- en terminaloperaties",
          de: "Container-Reachstacker für Hafen- und Terminalbetrieb",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Telehandlers", nl: "Verreikers", de: "Teleskoplader" },
        slug: "telehandlers",
        icon: "move-diagonal",
        description: {
          en: "Telescopic handlers for construction and agriculture",
          nl: "Verreikers voor bouw en landbouw",
          de: "Teleskoplader für Bau und Landwirtschaft",
        },
        sortOrder: 3,
      },
      {
        name: { en: "Other Material Handling", nl: "Overig Intern Transport", de: "Sonstige Flurförderzeuge" },
        slug: "other-material-handling",
        icon: "more-horizontal",
        description: {
          en: "Other material handling equipment",
          nl: "Overig intern transportmaterieel",
          de: "Sonstige Flurförderzeuge",
        },
        sortOrder: 4,
      },
    ],
  },
  {
    name: { en: "Forestry & Groundcare", nl: "Bosbouw & Groenonderhoud", de: "Forstwirtschaft & Grünpflege" },
    slug: "forestry-groundcare",
    icon: "trees",
    description: {
      en: "Forestry machinery and groundcare equipment",
      nl: "Bosbouwmachines en groenonderhoud apparatuur",
      de: "Forstmaschinen und Grünpflegegeräte",
    },
    sortOrder: 7,
  },

  // ─── VANS & LCVs ─────────────────────────────────────────────
  {
    name: { en: "Vans & LCVs", nl: "Bestelwagens", de: "Transporter" },
    slug: "vans-lcvs",
    icon: "van",
    description: {
      en: "Light commercial vehicles, vans and pickups",
      nl: "Lichte bedrijfsvoertuigen, bestelwagens en pickups",
      de: "Leichte Nutzfahrzeuge, Transporter und Pickups",
    },
    sortOrder: 8,
    children: [
      {
        name: { en: "Panel Vans", nl: "Gesloten Bestelwagens", de: "Kastenwagen" },
        slug: "panel-vans",
        icon: "van",
        description: {
          en: "Closed panel vans for cargo",
          nl: "Gesloten bestelwagens voor lading",
          de: "Geschlossene Kastenwagen für Fracht",
        },
        sortOrder: 1,
      },
      {
        name: { en: "Box Vans", nl: "Bakwagens", de: "Koffer-Transporter" },
        slug: "box-vans",
        icon: "package",
        description: {
          en: "Box body vans for delivery and logistics",
          nl: "Bakwagens voor bezorging en logistiek",
          de: "Koffer-Transporter für Lieferung und Logistik",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Refrigerated Vans", nl: "Koelbestelwagens", de: "Kühl-Transporter" },
        slug: "refrigerated-vans",
        icon: "thermometer-snowflake",
        description: {
          en: "Temperature-controlled vans for perishable goods",
          nl: "Temperatuurgecontroleerde bestelwagens voor bederfelijke goederen",
          de: "Temperaturgeführte Transporter für verderbliche Waren",
        },
        sortOrder: 3,
      },
      {
        name: { en: "Pickup Trucks", nl: "Pickups", de: "Pickups" },
        slug: "pickup-trucks",
        icon: "truck",
        description: {
          en: "Pickup trucks and utility vehicles",
          nl: "Pickups en bedrijfsvoertuigen",
          de: "Pickups und Nutzfahrzeuge",
        },
        sortOrder: 4,
      },
      {
        name: { en: "Chassis Cabs", nl: "Chassis Cabines", de: "Fahrgestelle" },
        slug: "chassis-cabs",
        icon: "square",
        description: {
          en: "Bare chassis cab vehicles for custom body builds",
          nl: "Chassis cabine voertuigen voor opbouw op maat",
          de: "Fahrgestelle für individuelle Aufbauten",
        },
        sortOrder: 5,
      },
      {
        name: { en: "Minibuses", nl: "Minibussen", de: "Kleinbusse" },
        slug: "minibuses",
        icon: "bus",
        description: {
          en: "Minibuses and passenger transport vans",
          nl: "Minibussen en personenvervoer bestelwagens",
          de: "Kleinbusse und Personentransporter",
        },
        sortOrder: 6,
      },
    ],
  },

  // ─── CARS ─────────────────────────────────────────────────────
  {
    name: { en: "Cars", nl: "Auto's", de: "PKW" },
    slug: "cars",
    icon: "car",
    description: {
      en: "Passenger cars, SUVs and recreational vehicles",
      nl: "Personenauto's, SUV's en recreatieve voertuigen",
      de: "PKW, SUV und Freizeitfahrzeuge",
    },
    sortOrder: 9,
    children: [
      {
        name: { en: "Passenger Cars", nl: "Personenauto's", de: "Personenwagen" },
        slug: "passenger-cars",
        icon: "car",
        description: {
          en: "Standard passenger cars and sedans",
          nl: "Standaard personenauto's en sedans",
          de: "Standard-PKW und Limousinen",
        },
        sortOrder: 1,
      },
      {
        name: { en: "SUVs", nl: "SUV's", de: "SUV" },
        slug: "suvs",
        icon: "car-front",
        description: {
          en: "Sport utility vehicles and crossovers",
          nl: "Sport utility vehicles en crossovers",
          de: "Sport Utility Vehicles und Crossover",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Campers & Caravans", nl: "Campers & Caravans", de: "Wohnmobile & Wohnwagen" },
        slug: "campers-caravans",
        icon: "tent",
        description: {
          en: "Motorhomes, campervans and caravans",
          nl: "Campers, kampeerauto's en caravans",
          de: "Wohnmobile, Campervans und Wohnwagen",
        },
        sortOrder: 3,
      },
      {
        name: { en: "Car Trailers", nl: "Autoaanhangwagens", de: "PKW-Anhänger" },
        slug: "car-trailers",
        icon: "link",
        description: {
          en: "Trailers designed for passenger cars",
          nl: "Aanhangwagens ontworpen voor personenauto's",
          de: "Anhänger für Personenkraftwagen",
        },
        sortOrder: 4,
      },
    ],
  },

  // ─── CONTAINERS ───────────────────────────────────────────────
  {
    name: { en: "Containers", nl: "Containers", de: "Container" },
    slug: "containers",
    icon: "box",
    description: {
      en: "Shipping containers, storage containers and specialty containers",
      nl: "Zeecontainers, opslagcontainers en speciale containers",
      de: "Seecontainer, Lagercontainer und Spezialcontainer",
    },
    sortOrder: 10,
    children: [
      {
        name: { en: "Shipping Containers", nl: "Zeecontainers", de: "Seecontainer" },
        slug: "shipping-containers",
        icon: "ship",
        description: {
          en: "Standard ISO shipping containers",
          nl: "Standaard ISO zeecontainers",
          de: "Standard-ISO-Seecontainer",
        },
        sortOrder: 1,
      },
      {
        name: { en: "Construction Containers", nl: "Bouwcontainers", de: "Baucontainer" },
        slug: "construction-containers",
        icon: "hard-hat",
        description: {
          en: "Site offices and construction storage containers",
          nl: "Bouwketen en opslagcontainers",
          de: "Baustellenbüros und Baucontainer",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Swap Body Containers", nl: "Wisselcontainers", de: "Wechselcontainer" },
        slug: "swap-body-containers",
        icon: "repeat",
        description: {
          en: "Swap body containers for intermodal transport",
          nl: "Wisselcontainers voor intermodaal transport",
          de: "Wechselcontainer für intermodalen Transport",
        },
        sortOrder: 3,
      },
      {
        name: { en: "Tank Containers", nl: "Tankcontainers", de: "Tankcontainer" },
        slug: "tank-containers",
        icon: "droplet",
        description: {
          en: "ISO tank containers for liquid transport",
          nl: "ISO tankcontainers voor vloeistoftransport",
          de: "ISO-Tankcontainer für Flüssigkeitstransport",
        },
        sortOrder: 4,
      },
      {
        name: { en: "Reefer Containers", nl: "Koelcontainers", de: "Kühlcontainer" },
        slug: "reefer-containers",
        icon: "thermometer-snowflake",
        description: {
          en: "Refrigerated containers for cold chain logistics",
          nl: "Koelcontainers voor koelketen logistiek",
          de: "Kühlcontainer für Kühlkettenlogistik",
        },
        sortOrder: 5,
      },
      {
        name: { en: "Accommodation Containers", nl: "Wooncontainers", de: "Wohncontainer" },
        slug: "accommodation-containers",
        icon: "home",
        description: {
          en: "Living and accommodation container units",
          nl: "Woon- en verblijfscontainers",
          de: "Wohn- und Unterkunftscontainer",
        },
        sortOrder: 6,
      },
      {
        name: { en: "Environmental Containers", nl: "Milieucontainers", de: "Umweltcontainer" },
        slug: "environmental-containers",
        icon: "leaf",
        description: {
          en: "Containers for hazardous materials and environmental services",
          nl: "Containers voor gevaarlijke stoffen en milieudiensten",
          de: "Container für Gefahrstoffe und Umweltdienstleistungen",
        },
        sortOrder: 7,
      },
    ],
  },

  // ─── PARTS & COMPONENTS ───────────────────────────────────────
  {
    name: { en: "Parts & Components", nl: "Onderdelen", de: "Teile & Komponenten" },
    slug: "parts-components",
    icon: "wrench",
    description: {
      en: "Spare parts, components and accessories",
      nl: "Reserveonderdelen, componenten en accessoires",
      de: "Ersatzteile, Komponenten und Zubehör",
    },
    sortOrder: 11,
    children: [
      {
        name: { en: "Truck Parts", nl: "Vrachtwagenonderdelen", de: "LKW-Teile" },
        slug: "truck-parts",
        icon: "cog",
        description: {
          en: "Replacement parts for trucks and heavy vehicles",
          nl: "Vervangende onderdelen voor vrachtwagens en zware voertuigen",
          de: "Ersatzteile für LKW und Schwerlastfahrzeuge",
        },
        sortOrder: 1,
        children: [
          {
            name: { en: "Engines", nl: "Motoren", de: "Motoren" },
            slug: "engines",
            icon: "engine",
            description: {
              en: "Complete engines and engine components",
              nl: "Complete motoren en motorcomponenten",
              de: "Komplette Motoren und Motorkomponenten",
            },
            sortOrder: 1,
          },
          {
            name: { en: "Transmissions", nl: "Versnellingsbakken", de: "Getriebe" },
            slug: "transmissions",
            icon: "settings",
            description: {
              en: "Gearboxes and transmission components",
              nl: "Versnellingsbakken en transmissiecomponenten",
              de: "Getriebe und Getriebekomponenten",
            },
            sortOrder: 2,
          },
          {
            name: { en: "Axles & Suspension", nl: "Assen & Ophanging", de: "Achsen & Federung" },
            slug: "axles-suspension",
            icon: "git-branch",
            description: {
              en: "Axles, suspension systems and related parts",
              nl: "Assen, ophangsystemen en gerelateerde onderdelen",
              de: "Achsen, Federungssysteme und zugehörige Teile",
            },
            sortOrder: 3,
          },
          {
            name: { en: "Brakes", nl: "Remmen", de: "Bremsen" },
            slug: "brakes",
            icon: "octagon",
            description: {
              en: "Brake systems, discs, pads and components",
              nl: "Remsystemen, schijven, blokken en componenten",
              de: "Bremssysteme, Scheiben, Beläge und Komponenten",
            },
            sortOrder: 4,
          },
          {
            name: { en: "Body Parts", nl: "Carrosserieonderdelen", de: "Karosserieteile" },
            slug: "body-parts",
            icon: "shield",
            description: {
              en: "Cab parts, panels, bumpers and body components",
              nl: "Cabineonderdelen, panelen, bumpers en carrosserieonderdelen",
              de: "Kabinenteile, Verkleidungen, Stoßstangen und Karosserieteile",
            },
            sortOrder: 5,
          },
          {
            name: { en: "Electrical & Electronics", nl: "Elektra & Elektronica", de: "Elektrik & Elektronik" },
            slug: "electrical-electronics",
            icon: "zap",
            description: {
              en: "Electrical systems, sensors, ECUs and wiring",
              nl: "Elektrische systemen, sensoren, ECU's en bedrading",
              de: "Elektrische Systeme, Sensoren, Steuergeräte und Verkabelung",
            },
            sortOrder: 6,
          },
          {
            name: { en: "Hydraulics", nl: "Hydrauliek", de: "Hydraulik" },
            slug: "hydraulics",
            icon: "droplets",
            description: {
              en: "Hydraulic pumps, cylinders, valves and hoses",
              nl: "Hydraulische pompen, cilinders, kleppen en slangen",
              de: "Hydraulikpumpen, Zylinder, Ventile und Schläuche",
            },
            sortOrder: 7,
          },
        ],
      },
      {
        name: { en: "Van/LCV Parts", nl: "Bestelwagenonderdelen", de: "Transporter-Teile" },
        slug: "van-lcv-parts",
        icon: "cog",
        description: {
          en: "Replacement parts for vans and light commercial vehicles",
          nl: "Vervangende onderdelen voor bestelwagens en lichte bedrijfsvoertuigen",
          de: "Ersatzteile für Transporter und leichte Nutzfahrzeuge",
        },
        sortOrder: 2,
      },
      {
        name: { en: "Tyres & Wheels", nl: "Banden & Wielen", de: "Reifen & Räder" },
        slug: "tyres-wheels",
        icon: "circle",
        description: {
          en: "Tyres, wheels and rims for all vehicle types",
          nl: "Banden, wielen en velgen voor alle voertuigtypen",
          de: "Reifen, Räder und Felgen für alle Fahrzeugtypen",
        },
        sortOrder: 3,
      },
    ],
  },
];

/**
 * Recursively create categories in the database.
 */
async function createCategories(
  categories: CategorySeed[],
  parentId: string | null = null
): Promise<void> {
  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        parentId,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
        listingCount: 0,
      },
    });

    if (cat.children && cat.children.length > 0) {
      await createCategories(cat.children, created.id);
    }
  }
}

/**
 * Seed all categories. Clears existing categories first to avoid duplicates.
 */
export async function seedCategories(): Promise<void> {
  console.log("Seeding categories...");

  // Clear existing data (respect FK constraints — delete children first via cascading order)
  await prisma.brandCategory.deleteMany();
  await prisma.category.deleteMany();

  await createCategories(CATEGORY_TREE);

  const count = await prisma.category.count();
  console.log(`Seeded ${count} categories successfully.`);
}
