
export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  gallery?: string[];
  date: string;
  projectUrl: string | null;
  client?: string;
  tags?: string[];
}
