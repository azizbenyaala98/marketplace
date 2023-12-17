import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

/**
 * Service for handling authentication operations.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  /**
   * Registers a new user with the provided email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns The registered user object or null if registration fails.
   */
  async registeruser({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  /**
   * Logs in a user with the provided email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns The logged in user object or null if login fails.
   */
  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }

  /**
   * Signs out the currently logged in user.
   */
  signout() {
    return signOut(this.auth);
  }

  /**
   * Gets the email of the currently logged in user.
   * @returns The email of the currently logged in user.
   */
  currentUser() {
    return this.auth.currentUser.email;
  }

  /**
   * Gets the ID of the currently logged in user.
   * @returns The ID of the currently logged in user.
   */
  currentId() {
    return this.auth.currentUser.uid;
  }
}
