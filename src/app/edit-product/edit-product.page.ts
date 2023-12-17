
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product, ProductCategory } from '../models/product';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
  productId: string;
  product: Product = {
    title: '',
    price: 0,
    description: '',
    category: ProductCategory.Sell, // Set the default category
    imageUrl: '',
  };
  productImage: string | ArrayBuffer;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      
    });
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
  EditProduct(){
    this.productService.updateProduct(this.product)
    
  }

 

}
