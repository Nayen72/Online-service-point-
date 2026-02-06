
export interface PageInfo {
  title: string;
  description: string;
}

export interface SiteMapNode {
  name: string;
  children?: SiteMapNode[];
}

export interface PlatformAnalysis {
  recommendation: string;
  reasoning: string;
  pros: string[];
  cons: string[];
}

export interface Feature {
  name: string;
  description: string;
}

export interface Blueprint {
  productName: string;
  budget: 'small' | 'large';
  mustHavePages: PageInfo[];
  siteMap: SiteMapNode;
  platformAnalysis: PlatformAnalysis;
  essentialFeatures: Feature[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; items: string[] }[];
}

export interface ExtraSection {
  title: string;
  content: string;
  type: 'checker' | 'guide' | 'info' | 'cta';
  items?: string[];
}

export interface StoreDesign {
  businessName: string;
  style: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  navigation?: NavItem[];
  fonts: {
    heading: string;
    body: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  bestSellers: {
    name: string;
    price: string;
    category: string;
    imageDescriptions: string[];
    isOutOfStock?: boolean;
  }[];
  testimonials: {
    name: string;
    comment: string;
    rating: number;
  }[];
  extraSections?: ExtraSection[];
}

export interface ProductCopy {
  productName: string;
  hook: string;
  benefits: {
    title: string;
    description: string;
  }[];
  technicalSpecs?: {
    label: string;
    value: string;
  }[];
  cta: string;
  fullDraft: string;
}
