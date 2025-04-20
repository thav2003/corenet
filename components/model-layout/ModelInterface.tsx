export interface Model {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category?: string;
  framework?: string;
  tags?: string[];
  downloads?: number;
  rating?: number;
  popularity?: number;
  createdAt?: string;
}
