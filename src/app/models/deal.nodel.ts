export interface DealData {
  Id: string;
  Name: string;
  Slug: string;
  Image: string;
  ImageAltText: string | null;
  Banner: string;
  BannerAltText: string | null;
  BannerHeading: string;
  BannerText: string;
  MetaTitle: string;
  MetaDescription: string;
  MetaKeyword: string;
  Content: string;
  Category: string;
  IsActive: string;
  CreateDate: string;
  ModifiedDate: string;
}

export interface DealResponse {
  status: boolean;
  data: DealData | null;
}
