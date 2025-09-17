
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}