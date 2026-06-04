
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  rarity?: 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common';
  rarityLabel?: string;
}
