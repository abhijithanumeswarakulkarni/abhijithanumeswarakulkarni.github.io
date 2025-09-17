// Define a more structured type for skill information

type Devicon = {
  source: 'devicon';
  slug: string;
  variant: 'plain' | 'original' | 'line' | 'wordmark' | 'original-wordmark' | 'plain-wordmark';
};

type ExternalIcon = {
  source: 'external';
  url: string;
};

export interface SkillInfo {
  name: string;
  icon?: Devicon | ExternalIcon;
}
