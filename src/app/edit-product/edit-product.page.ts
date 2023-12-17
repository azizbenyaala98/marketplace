import { Component, OnInit } from '@angular/core';
import {
  Storage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product, ProductCategory } from '../models/product';

/**
 * Represents the EditProductPage component.
 */
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
  storage: Storage;
  ref: typeof ref;
  productId: string;
  uploadCompleted = true;
  product: Product = {
    title: '',
    price: 0,
    description: '',
    category: ProductCategory.Sell, // Set the default category
    imageUrl: '',
    phone: 0,
  };
  productImage: string | ArrayBuffer;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.storage = getStorage();
    this.ref = ref;
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.productService.getProduct(params['id']).then((product) => {
        this.product = product;
      });
    });
  }

  /**
   * Handles the file change event.
   * @param event The file change event.
   */
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

  /**
   * Navigates to the dashboard page.
   */
  navigate() {
    this.router.navigateByUrl(`/dashboard`);
  }

  /**
   * Uploads a file.
   * @param event The file upload event.
   */
  uploadFile(event: any) {
    this.uploadCompleted = false;
    const file = event.target.files[0];
    const fileName = file.name; // Get the file name
    const filePath = fileName + new Date().toISOString();
    const ref = this.ref(this.storage, filePath);
    uploadBytes(ref, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      getDownloadURL(ref).then((downloadUrl) => {
        this.productImage = downloadUrl;
        this.product.imageUrl = downloadUrl;
        this.uploadCompleted = true;
      });
    });
  }

  /**
   * Updates the product.
   */
  EditProduct() {
    if (!this.uploadCompleted) {
      alert('Please upload first');
      return;
    }
    this.productService.updateProduct(this.product).then(() => {
      this.router.navigateByUrl(`/dashboard`);
    });
  }
}
