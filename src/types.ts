export type Category = 'Job Hunting' | 'Socials' | 'Project Repos' | 'Other';

export const CATEGORIES: Category[] = ['Job Hunting', 'Socials', 'Project Repos', 'Other'];

export interface Link {
  id: string;
  label: string;
  url: string;
  category: Category;
  shortcutIndex: number;
  createdAt: number;
}
