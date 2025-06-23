export interface BookDetails {
    bookId: string,
    title: string,
    subtitle: string,
    author: string,
    publishedDate: string,
    description: string,
    pageCount: number,
    language: string,
    categories: string[],
    coverImage: string,
    averageRating: number,
    reviewCount: number,
    price: Price,
    createdAt: string,
    updatedAt: string
}

export interface Price {
    currency: string;
    amount: number;
}
