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
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}
