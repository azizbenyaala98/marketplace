import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import{provideFirestore,getFirestore} from '@angular/fire/firestore'
import  {provideStorage ,getStorage} from '@angular/fire/storage'
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
     IonicModule.forRoot(),
      AppRoutingModule,
      provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    provideAuth(()=>getAuth()),
    provideStorage(()=>getStorage()),
    provideFirestore(()=>getFirestore())

    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
