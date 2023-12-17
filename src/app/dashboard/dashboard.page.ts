

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Component,OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Product, ProductCategory } from '../models/product';
import { User } from '@angular/fire/auth';
import { filter, Subscription } from 'rxjs';
import { deleteDoc, doc, Firestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})


export class DashboardPage implements OnInit {


  ngOnInit(){
    console.log(this.activeUser)
    console.log(this.userId)
    
    this.productListSubscription = this.productService.getProductsByActiveUser().subscribe((products: Product[]) => {
    // Ensure that each product has an 'id' property before assigning to productList
    this.productList = products.map(product => {
      if (product.id) {
        return product;
      } else {
        // Handle the case where the product doesn't have an 'id'
        console.error("Product is missing an 'id':", product);
        return null;
      }
    }).filter(Boolean); // Remove null entries from the array
  });
      
  }
  productList: Product[];
  productListSubscription: Subscription;

  
  constructor(private auth:AuthService,
    private router :Router,
    private route: ActivatedRoute,
   private productService:ProductService,
   private firestore:Firestore
   ) { }
   
  productImage: any;
 product = {
  
    title: '',
    price: 0,
    description: '',
    category:ProductCategory.Sell,
    imageUrl:''
  };
  submitProduct() {
    // Handle submitting the product data here
    
    console.log('Product data:', this.product);
    this.productService.addProduct(this.product)
  }



  @ViewChild(IonModal) modal: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  activeUser=this.sub(this.auth.currentUser())
  userId=this.auth.currentId()

  
  logout(){
    this.auth.signout()
    this.router.navigateByUrl('/login')
  }

  toAddProduct(){
    
  }

  editProduct(id:string){console.log(id)
  this.router.navigateByUrl(`/edit-product/${id}`)
  }
 

  deleteProduct(id: string) {
    if (id) {
      const docRef = doc(this.firestore, 'products', id);
  
      deleteDoc(docRef)
        .then(() => {
          console.log("Document successfully deleted!");
          // Optionally, you may want to update your local product list after deletion
          this.productList = this.productList.filter(product => product.id !== id);
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    } else {
      console.error("Invalid ID provided for deletion");
    }
  }



  sub(input: string): string {
    const atIndex = input.indexOf('@');
  
    if (atIndex !== -1) {
      return input.substring(0, atIndex);
    }
  
    // If "@" is not found, return the original string or handle it as needed
    return input;
  }
  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.productImage = reader.result; // This is the image in base64 format
        // You may need to adjust this based on how you're handling images in your app
      };
    }
  }
 
}
