import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore,collectionData, query, where, doc,deleteDoc,updateDoc, getDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

import { Product, ProductCategory } from '../models/product';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private collectionName = 'products';

  
  constructor(private firestore :Firestore,
    private auth :AuthService){}
 
    addProduct(product: Product) {
      product.userId = this.auth.currentId();
      const collectionInstance = collection(this.firestore, 'products');
    
      addDoc(collectionInstance, product)
        .then((docRef) => {
          // Assign the generated id to the product
          product.id = docRef.id;
          console.log("saved data successfully with the id  ", docRef.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    




  getProducts(): Observable<Product[]> {
    const collectionInstance = collection(this.firestore, 'products');
    return collectionData(collectionInstance) as Observable<Product[]>;
  }

  getProductsByActiveUser(): Observable<Product[]> {
    const collectionInstance = collection(this.firestore, 'products');
    const userProductsQuery = query(collectionInstance, where('userId', '==', this.auth.currentId()));
    return collectionData(userProductsQuery, { idField: 'id' }) as Observable<Product[]>;
  }
 // Function to delete a product
 

 deleteProduct(id: string) {
  if (id) {
    const docRef = doc(this.firestore, 'products', id);
    deleteDoc(docRef)
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  } else {
    console.error("Invalid ID provided for deletion");
  }
}

updateProduct(product: Product): Promise<void> {
  const { id, ...productData } = product;
  const productDocRef = doc(this.firestore, this.collectionName, id);
  return updateDoc(productDocRef, productData);
}
  



}

    

  

 

   

