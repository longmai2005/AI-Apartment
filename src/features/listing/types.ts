export interface Listing {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  area: string;
  district: string;
  province: string;
  type: string;
  image: string;
  tags: string[];
  verified: boolean;
  rating: number;
  description: string;
  amenities: string[];
  postedAt: string;
  sourceUrl: string;
  lat?: number;
  lng?: number;
}
