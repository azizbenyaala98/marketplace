import { Injectable } from '@angular/core';
import { ref, Storage, uploadString } from '@angular/fire/storage';
import {Photo} from '@capacitor/camera'

@Injectable({
  providedIn: 'root'
})
export class ImageUploadServiceService {

  constructor(private storage: Storage) {}
  
  async uploadImage(cameraFile:Photo,productId: string){
    const filePath = `product-images/${productId}/image.jpg`;
    const storageRef=ref(this.storage,filePath);
    try {
      await uploadString(storageRef,cameraFile.base64String,'base64')
    } catch (error) {
      
    }
  }


}
