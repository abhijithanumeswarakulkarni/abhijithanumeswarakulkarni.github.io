export interface Portal {
  id:     string;
  label:  string;
  fx:     number;
  fy:     number;
  color:  string;  // mid shade (cube faces / panel chrome)
  bright: string;  // light shade (label glow / accents)
}

/*
 * White / silver palette — every section is a shade of white with a faint
 * tint so the six buildings stay subtly distinguishable. `color` = mid (light
 * grey) face, `bright` = highlight. The deep shade is derived in code via shd().
 */
export const PORTALS: Portal[] = [
  { id: 'about',      label: 'ABOUT',      fx: 0.20, fy: 0.20, color: '#EAEEF4', bright: '#FFFFFF' },
  { id: 'education',  label: 'EDUCATION',  fx: 0.78, fy: 0.18, color: '#DCE4EE', bright: '#F4F8FF' },
  { id: 'experience', label: 'EXPERIENCE', fx: 0.84, fy: 0.62, color: '#ECDFD8', bright: '#FFF6F0' },
  { id: 'projects',   label: 'PROJECTS',   fx: 0.52, fy: 0.82, color: '#ECE6D6', bright: '#FFFBF0' },
  { id: 'skills',     label: 'SKILLS',     fx: 0.16, fy: 0.62, color: '#DCEEE2', bright: '#F0FFF6' },
  { id: 'contact',    label: 'CONTACT',    fx: 0.50, fy: 0.42, color: '#DCEAF2', bright: '#F0FAFF' },
];
