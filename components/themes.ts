// Seasonal theming for the game world.
// Buildings/coins stay gold across all seasons (brand constant); the
// environment — ground, scenery, walls, skid/dust, ambient weather — changes.

export type Season = 'desert' | 'forest' | 'ice';

export interface Theme {
  id:         Season;
  season:     string;   // e.g. "SUMMER"
  world:      string;   // e.g. "DESERT"
  icon:       string;   // emoji for toggle / loader
  accent:     string;   // themed accent (transition + toggle)
  accentDark: string;

  bg:       string;                       // background fill
  tileA:    string;
  tileB:    string;
  tileEdge: string;
  wall:     [string, string, string];     // boundary cube faces (top, right, left)

  skidRGB:  string;     // "r,g,b" for skid marks
  dustRGB:  string;     // "r,g,b" for drift dust
  ambient:  'sand' | 'leaves' | 'snow';
}

// Grounds are kept at a medium tone so the white buildings always contrast.
export const THEMES: Record<Season, Theme> = {
  desert: {
    id: 'desert', season: 'SUMMER', world: 'DESERT', icon: '☀',
    accent: '#E0913B', accentDark: '#6E3E10',
    bg: '#C2A058', tileA: '#D4B878', tileB: '#C8A862', tileEdge: '#A88848',
    wall: ['#BE9C5E', '#9C7A42', '#785A2E'],
    skidRGB: '74,50,18', dustRGB: '224,200,150', ambient: 'sand',
  },
  forest: {
    id: 'forest', season: 'SPRING / FALL', world: 'WOODLAND', icon: '🍂',
    accent: '#E0742E', accentDark: '#7A3A12',
    bg: '#3f8a2e', tileA: '#4fa235', tileB: '#45922d', tileEdge: '#327020',
    wall: ['#8a9a5e', '#667444', '#46502e'],
    skidRGB: '40,32,16', dustRGB: '150,120,70', ambient: 'leaves',
  },
  ice: {
    id: 'ice', season: 'WINTER', world: 'TUNDRA', icon: '❄',
    accent: '#5FB8E0', accentDark: '#1A5A78',
    bg: '#8FB8CC', tileA: '#A6CEDE', tileB: '#96BfD2', tileEdge: '#7AA2B8',
    wall: ['#BFE0EE', '#94BCD2', '#6E96B0'],
    skidRGB: '64,90,114', dustRGB: '245,250,255', ambient: 'snow',
  },
};

export const SEASON_ORDER: Season[] = ['desert', 'forest', 'ice'];

export function seasonForMonth(m: number): Season {
  if (m >= 5 && m <= 7) return 'desert';      // Jun–Aug
  if (m === 11 || m <= 1) return 'ice';       // Dec–Feb
  return 'forest';                            // Mar–May, Sep–Nov
}
