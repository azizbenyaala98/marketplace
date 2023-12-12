

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Component,OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ProductCategory } from '../models/product';
import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})


export class DashboardPage implements OnInit {
  
  constructor(private auth:AuthService,
    private router :Router,
    private route: ActivatedRoute,
   private productService:ProductService
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
ngOnInit(){
  console.log(this.activeUser)
  console.log(this.userId)
    
}
  

 

  logout(){
    this.auth.signout()
    this.router.navigateByUrl('/login')
  }

  toAddProduct(){
    
  }
  /*ToAddProduct(){
    const collectionInstance= collection(this.firestore,'products');
    addDoc(collectionInstance, {
      title: 'Example Product',
      category: ProductCategory.Sell, // Use the enum value here
      price: 100,
      description: 'This is a sample product description',
      imageUrl: 'https://example.com/product_image.jpg'
    }
    ).then(()=>{
      console.log("saved data succesfully")
    }).catch((err)=>{
      console.log(err)
        })



   
  }*/
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
