import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore,collectionData } from '@angular/fire/firestore';

import { Product, ProductCategory } from '../models/product';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private firestore :Firestore,
    private auth :AuthService){}
  addProduct(product:Product){
    product.userId=this.auth.currentId()
    const collectionInstance= collection(this.firestore,'products');
    addDoc(collectionInstance,product
    
    ).then(()=>{
      console.log("saved data succesfully")
    }).catch((err)=>{
      console.log(err)
        })
  }
  getProducts(){
    const collectionInstance= collection(this.firestore,'products');
    collectionData(collectionInstance).subscribe(val =>{
      console.log(val)
    })



    

  }
}
 

   

