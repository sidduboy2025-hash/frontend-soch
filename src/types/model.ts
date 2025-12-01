export type AiModel = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  tags: string[];
  provider: string;
  pricing: "free" | "freemium" | "paid";
  rating: number;
  reviewsCount: number;
  installsCount?: number;
  capabilities: ("text" | "image" | "audio" | "video" | "code" | "agent")[];
  isApiAvailable: boolean;
  isOpenSource: boolean;
  lastUpdated: string;
  modelType: string;
  externalUrl: string;
  iconUrl?: string;
  screenshots?: string[];
  featured?: boolean;
  trendingScore?: number;
  bestFor?: string[];
  features?: string[];
  examplePrompts?: string[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  modelCount: number;
};
