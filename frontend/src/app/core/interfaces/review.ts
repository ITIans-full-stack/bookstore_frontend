export interface Review {
  _id?: string; 
  rating: number;
  comment: string;
  book: string; 
  user: {
    _id: string;
    name: string;
  };
}
