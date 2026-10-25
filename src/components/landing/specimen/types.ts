export interface ShowcaseItem {
  id: string;
  company: string;
  role: string;
  url: string;
  location: string;
  salary: string;
  source: string;
  tags: string[];
  notes: string;
  latencyMs: number;
  tokensUsed: number;
}

export type SpecimenTab = 'board' | 'extraction' | 'telegram';
