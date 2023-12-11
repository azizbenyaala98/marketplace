import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

    ngOnInit() {
      this.productService.getProducts()
     
        
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
