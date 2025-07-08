export interface BookInterface {
   _id: string;
  title: string;
  author: string;
  price: number;
  discount: number;
  category: string;
  description: string;
  stock: number;
  image: string;
  images: any[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  averageRating ? :number ;
}
