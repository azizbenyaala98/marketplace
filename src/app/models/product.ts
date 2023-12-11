export enum ProductCategory {
    Rent = 'rent',
    Sell = 'sell'
  }
  
  export interface Product {
    id?: string;
    title: string;
    category: ProductCategory; 
    price: number;
    description: string;
    imageUrl: string;
    userId?: string;
    
  }