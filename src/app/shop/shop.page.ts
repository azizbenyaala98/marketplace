import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  productList: Product[];
  productListSubscription: Subscription;


  ngOnInit() {
    this.productListSubscription = this.productService.getProducts().subscribe((products: Product[]) => {
      this.productList = products;
    });
  }

  constructor(private router: Router,
    private productService :ProductService) {}

  goToSignUp() {
    // Define the action for Sign Up button
    this.router.navigate(['/signup']);
  }

  goToSignIn() {
    // Define the action for Sign In button
    this.router.navigate(['/login']);
  }

}
