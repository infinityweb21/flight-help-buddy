export interface PackageImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

export interface BannerSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  shapeImage: string;
}

export interface MainContentSection {
  title: string;
  description: string;
}

export interface InclusionCategory {
  category: string;
  items: string[];
}

export interface InclusionsSection {
  title: string;
  categories: InclusionCategory[];
}

export interface GallerySection {
  title: string;
  component: string;
  settings: {
    numVisible: number;
    responsive: boolean;
    maxWidth: string;
  };
}

export interface LocationSection {
  title: string;
  mapUrl: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  note?: string;
}

export interface ItineraryDayDetails {
  accommodation?: string[];
  includedActivities?: string[];
  mealsIncluded?: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  expanded: boolean;
  details?: ItineraryDayDetails;
  note?: string;
}

export interface ItinerarySection {
  title: string;
  type: string;
  days: ItineraryDay[];
}

export interface PackageSections {
  banner: BannerSection;
  mainContent: MainContentSection;
  inclusions: InclusionsSection;
  gallery: GallerySection;
  location: LocationSection;
  itinerary: ItinerarySection;
}

export interface TravelPackage {
  slug: string;
  pageTitle: string;
  pageType: string;
  sections: PackageSections;
  images: PackageImage[];
  responsiveOptions: any[];
}