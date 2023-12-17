export enum ProductCategory {
  Rent = 'rent',
  Sell = 'sell',
}

/**
 * Represents a product.
 */
export interface Product {
  /**
   * The unique identifier of the product.
   */
  id?: string;
  /**
   * The title of the product.
   */
  title: string;
  /**
   * The category of the product.
   */
  category: ProductCategory;
  /**
   * The price of the product.
   */
  price: number;
  /**
   * The description of the product.
   */
  description: string;
  /**
   * The URL of the product's image.
   */
  imageUrl: string;
  /**
   * The unique identifier of the user who owns the product.
   */
  userId?: string;
  /**
   * The phone number associated with the product.
   */
  phone: number;
}
