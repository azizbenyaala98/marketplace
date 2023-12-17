import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

/**
 * Represents the LoginPage component.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    private alertController: AlertController,
    public router: Router
  ) {}

  /**
   * Gets the email form control.
   * @returns The email form control.
   */
  get email() {
    return this.loginForm.get('email');
  }

  /**
   * Gets the password form control.
   * @returns The password form control.
   */
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Navigates to the shop page.
   */
  navigate() {
    this.router.navigateByUrl('/shop');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}'),
        ],
      ],
    });
  }

  /**
   * Gets the error control of the login form.
   * @returns The error control of the login form.
   */
  get ErrorControl() {
    return this.loginForm?.controls;
  }

  /**
   * Shows an alert with the given header and message.
   * @param header - The header of the alert.
   * @param message - The message of the alert.
   */
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['ok'],
    });
    await alert.present();
  }

  /**
   * Performs the login action.
   * Displays a loading spinner while waiting for the login request to complete.
   * If the login is successful, navigates to the dashboard page.
   * Otherwise, shows an alert with a login failure message.
   */
  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    const user = await this.authService.login(this.loginForm.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } else {
      this.showAlert('login failed ', 'plz try again');
    }
  }
}
