// Shared data contract for the OUTPLAY site. All copy is bilingual.
export type Lang = 'bg' | 'en';
export interface L {
  bg: string;
  en: string;
}

export type CategoryId = 'bioclimatic-pergolas' | 'glass-systems' | 'sun-protection' | 'windbreaks';

/** Drives which dimension fields / option groups the inquiry form shows. */
export type InquiryFamily = 'pergola' | 'glass' | 'door' | 'zip' | 'awning' | 'windbreak';

export interface Category {
  id: CategoryId;
  order: number;
  /** Nav label, e.g. "Биоклиматични перголи" */
  name: L;
  /** H1 on the category page */
  title: L;
  /** One-line headline */
  tagline: L;
  /** Intro paragraphs */
  intro: L[];
  /** Optional grouping inside a category (e.g. automated vs fixed-roof pergolas) */
  subgroups?: { id: string; name: L; description?: L; productIds: string[] }[];
}

/** A key fact taken from the catalogue text, shown in a spec strip. */
export interface Highlight {
  value: string; // "117", "0–120°", "2–4", "100%"
  unit?: L; // "км/ч" / "km/h"
  label: L; // "устойчивост на вятър" / "wind resistance"
}

export interface ProductSection {
  heading: L;
  paragraphs: L[];
}

export interface Configuration {
  title: L;
  text?: L;
}

export interface Product {
  /** = URL slug */
  id: string;
  category: CategoryId;
  subgroup?: string;
  family: InquiryFamily;
  order: number;
  /** Short display name: "Balance", "Гилотина" / "Guillotine" */
  name: L;
  /** Full catalogue name */
  fullName: L;
  /** Catalogue headline, e.g. "Геометрия на светлината." */
  tagline: L;
  /** 1–2 sentences for cards, meta description and search */
  summary: L;
  sections: ProductSection[];
  /** 2–4 facts printed in the catalogue (never invented) */
  highlights: Highlight[];
  features: L[];
  /** Spec rows derived from facts stated in the catalogue text */
  specs: { label: L; value: L }[];
  configurations?: Configuration[];
  options?: L[];
  /** 2–3 related product ids */
  related: string[];
  /** Extra search terms (synonyms, latin/cyrillic variants) */
  keywords?: string[];
  video?: { url: string; title: L };
}

export interface FaqItem {
  q: L;
  a: L;
}
export interface FaqGroup {
  id: string;
  title: L;
  items: FaqItem[];
}

/** Inquiry form definition per product family */
export interface DimensionField {
  id: 'width' | 'depth' | 'height' | 'length' | 'units';
  label: L;
  hint?: L;
  unit: 'm' | 'pcs';
  min: number;
  max: number;
  step: number;
  default: number;
}
export interface OptionGroup {
  id: string;
  label: L;
  type: 'single' | 'multi';
  choices: { id: string; label: L }[];
  default?: string | string[];
}
export interface InquiryFamilyDef {
  family: InquiryFamily;
  dimensions: DimensionField[];
  /** Short label for the drawn preview, e.g. plan view vs elevation */
  preview: 'plan' | 'elevation';
  optionGroups: OptionGroup[];
}

/** Image metadata keyed by path relative to src/assets/img, e.g. "products/balance/hero.jpg" */
export interface ImageMeta {
  alt: L;
  /** CSS object-position, e.g. "50% 60%" */
  focal?: string;
}

/** Hotspot positioned in % of the image box */
export interface Hotspot {
  x: number;
  y: number;
  label: L;
  /** Optional link target */
  productId?: string;
  categoryId?: CategoryId;
}

export interface BeforeAfterPair {
  id: string;
  before: string; // image path relative to src/assets/img
  after: string;
  beforeLabel: L;
  afterLabel: L;
  title: L;
  caption: L;
}

export interface GalleryItem {
  image: string; // path relative to src/assets/img
  category: CategoryId;
  productId?: string;
  caption: L;
}

export interface ReferenceProject {
  id: string;
  image: string;
  name: string; // as printed (brand/project name)
  type: L; // e.g. "Жилищен комплекс" / "Residential complex"
}
