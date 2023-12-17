import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

/**
 * Represents the ShopPage component.
 */
@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  /**
   * The list of products.
   */
  productList: Product[];

  /**
   * The subscription to the product list.
   */
  productListSubscription: Subscription;

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.productListSubscription = this.productService
      .getProducts()
      .subscribe((products: Product[]) => {
        this.productList = products;
      });
  }

  /**
   * Constructs a new instance of the ShopPage component.
   * @param router - The router service.
   * @param productService - The product service.
   */
  constructor(private router: Router, private productService: ProductService) {}

  /**
   * Navigates to the sign up page.
   */
  goToSignUp() {
    // Define the action for Sign Up button
    this.router.navigate(['/signup']);
  }

  /**
   * Navigates to the sign in page.
   */
  goToSignIn() {
    // Define the action for Sign In button
    this.router.navigate(['/login']);
  }
}
