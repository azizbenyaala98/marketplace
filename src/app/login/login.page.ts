import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm:FormGroup

  
  constructor(public formBuilder : FormBuilder,
    public loadingCtrl:LoadingController,
    public authService:AuthService,
    private   alertController: AlertController,
    public router :Router) 
    { }
    get email(){
      return this.loginForm.get('email')
    }
    get password(){
      return this.loginForm.get('password')
    }

  
    ngOnInit() {
      this.loginForm=this.formBuilder.group({
        
        email:['',[
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
        ]],
        password:['',[
          Validators.required,
          Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
        ]]
         
      })
  
        
    }
    get  ErrorControl(){

      return this.loginForm?.controls;
    }
  
    async showAlert(header,message){
      const alert =await this.alertController.create({
        header,
        message,
        buttons:['ok'],
      });
      await alert.present();
    }
    async login() {
      const loading =await this.loadingCtrl.create();
      await loading.present();
      const user =await this.authService.login(this.loginForm.value)
      await loading.dismiss();
  
      if (user){this.router.navigateByUrl('/dashboard',{replaceUrl:true})
  
      }else
      this.showAlert('login failed ','plz try again')
  
    }

}
