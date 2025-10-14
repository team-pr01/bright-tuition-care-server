
export type TCourse = {
  imageUrl?: string;
  title: string;
  subtitle: string;
  tagline: string;
  duration: string;
  benefits : string[];
  accessType : "Lifetime" | "Limited";
  accessValidity: Date;
  category: string;
  basePrice: number;
  discountedPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};