import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  collectionData,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

import { Product, ProductCategory } from '../models/product';
import { AuthService } from './auth.service';
/**
 * Service responsible for managing products.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private collectionName = 'products';

  constructor(private firestore: Firestore, private auth: AuthService) {}

  /**
   * Adds a new product to the collection.
   * @param product - The product to be added.
   * @returns A promise that resolves to the ID of the added product.
   */
  async addProduct(product: Product): Promise<string | boolean> {
    product.userId = this.auth.currentId();
    const collectionInstance = collection(this.firestore, 'products');

    return addDoc(collectionInstance, product)
      .then((docRef) => {
        // Assign the generated id to the product
        product.id = docRef.id;
        console.log('saved data successfully with the id  ', docRef.id);
        return product.id;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  /**
   * Retrieves all products from the collection.
   * @returns An observable that emits an array of products.
   */
  getProducts(): Observable<Product[]> {
    const collectionInstance = collection(this.firestore, 'products');
    return collectionData(collectionInstance) as Observable<Product[]>;
  }

  /**
   * Retrieves products belonging to the active user.
   * @returns An observable that emits an array of products.
   */
  getProductsByActiveUser(): Observable<Product[]> {
    const collectionInstance = collection(this.firestore, 'products');
    const userProductsQuery = query(
      collectionInstance,
      where('userId', '==', this.auth.currentId())
    );
    return collectionData(userProductsQuery, { idField: 'id' }) as Observable<
      Product[]
    >;
  }

  /**
   * Deletes a product from the collection.
   * @param id - The ID of the product to be deleted.
   */
  deleteProduct(id: string): void {
    if (id) {
      const docRef = doc(this.firestore, 'products', id);
      deleteDoc(docRef)
        .then(() => {
          console.log('Document successfully deleted!');
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
        });
    } else {
      console.error('Invalid ID provided for deletion');
    }
  }

  /**
   * Updates a product in the collection.
   * @param product - The updated product.
   * @returns A promise that resolves when the update is complete.
   */
  updateProduct(product: Product): Promise<void> {
    const { id, ...productData } = product;
    const productDocRef = doc(this.firestore, this.collectionName, id);
    return updateDoc(productDocRef, productData);
  }

  /**
   * Retrieves a product from the collection by its ID.
   * @param id - The ID of the product to retrieve.
   * @returns A promise that resolves to the retrieved product.
   * @throws An error if the product does not exist.
   */
  async getProduct(id: string): Promise<Product> {
    const productDocRef = doc(this.firestore, this.collectionName, id);
    const productSnapshot = await getDoc(productDocRef);
    const exist = productSnapshot.exists();
    if (!exist) {
      throw new Error(`Product with id ${id} does not exist`);
    }
    const productData = productSnapshot.data();
    return {
      id: productSnapshot.id,
      ...productData,
    } as Product;
  }
}
