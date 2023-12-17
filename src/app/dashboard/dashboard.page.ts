import {
  Storage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Product, ProductCategory } from '../models/product';
import { User } from '@angular/fire/auth';
import { filter, finalize, Subscription } from 'rxjs';
import { deleteDoc, doc, Firestore } from '@angular/fire/firestore';
/**
 * Represents the DashboardPage component.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  storage: Storage;
  ref: typeof ref;
  uploadCompleted = true;

  /**
   * Initializes the component.
   */
  ngOnInit() {
    console.log(this.activeUser);
    console.log(this.userId);
    this.storage = getStorage();
    this.ref = ref;

    this.productListSubscription = this.productService
      .getProductsByActiveUser()
      .subscribe((products: Product[]) => {
        // Ensure that each product has an 'id' property before assigning to productList
        this.productList = products
          .map((product) => {
            if (product.id) {
              console.log('Productr', product);
              return product;
            } else {
              // Handle the case where the product doesn't have an 'id'
              console.error("Product is missing an 'id':", product);
              return null;
            }
          })
          .filter(Boolean); // Remove null entries from the array
      });
  }

  productList: Product[];
  productListSubscription: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private firestore: Firestore
  ) {}

  productImage: any;
  product = {
    title: '',
    price: 0,
    description: '',
    category: ProductCategory.Sell,
    imageUrl: '',
    phone: 25252525,
  };

  /**
   * Submits the product data.
   */
  submitProduct() {
    // Handle submitting the product data here

    console.log('Product data:', this.product);
    if (!this.uploadCompleted) {
      alert('Please upload first');
      return;
    }
    this.productService.addProduct(this.product).then(() => {
      this.modal.dismiss(null, 'cancel');
      this.product = {
        title: '',
        price: 0,
        description: '',
        category: ProductCategory.Sell,
        imageUrl: '',
        phone: 0,
      };
    });
  }

  @ViewChild(IonModal) modal: IonModal;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  /**
   * Cancels the modal.
   */
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  /**
   * Confirms the modal.
   */
  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  /**
   * Handles the event when the modal is about to be dismissed.
   * @param event - The event object.
   */
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  activeUser = this.sub(this.auth.currentUser());
  userId = this.auth.currentId();

  /**
   * Logs out the user.
   */
  logout() {
    this.auth.signout();
    this.router.navigateByUrl('/login');
  }

  toAddProduct() {}

  /**
   * Edits a product.
   * @param id - The ID of the product to edit.
   */
  editProduct(id: string) {
    console.log(id);
    this.router.navigateByUrl(`/edit-product/${id}`);
  }

  /**
   * Deletes a product.
   * @param id - The ID of the product to delete.
   */
  deleteProduct(id: string) {
    if (id) {
      const docRef = doc(this.firestore, 'products', id);

      deleteDoc(docRef)
        .then(() => {
          console.log('Document successfully deleted!');
          // Optionally, you may want to update your local product list after deletion
          this.productList = this.productList.filter(
            (product) => product.id !== id
          );
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
        });
    } else {
      console.error('Invalid ID provided for deletion');
    }
  }

  /**
   * Substitutes the input string by removing everything after the '@' character.
   * @param input - The input string.
   * @returns The modified string.
   */
  sub(input: string): string {
    const atIndex = input.indexOf('@');

    if (atIndex !== -1) {
      return input.substring(0, atIndex);
    }

    // If "@" is not found, return the original string or handle it as needed
    return input;
  }

  /**
   * Uploads a file to Firebase using Angular.
   * @param event - The file upload event.
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
        console.log('downloadUrl', downloadUrl);
        this.productImage = downloadUrl;
        this.product.imageUrl = downloadUrl;
        this.uploadCompleted = true;
      });
    });
  }
}
