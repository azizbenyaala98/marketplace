import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm:FormGroup

  constructor(public formBuilder : FormBuilder,
    public loadingCtrl:LoadingController,
    public authService:AuthService,
    public router:Router ,
    private alertController :AlertController ) { }


  ngOnInit() {
    this.regForm=this.formBuilder.group({
      fullname:['',Validators.required],
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

  async showAlert(header,message){
    const alert =await this.alertController.create({
      header,
      message,
      buttons:['ok'],
    });
    await alert.present();
  }

  async signUp(){
    const loading =await this.loadingCtrl.create();
    await loading.present();
    const user =await this.authService.registeruser(this.regForm.value)
    await loading.dismiss();

    if (user){this.router.navigateByUrl('/login',{replaceUrl:true})

    }else
    this.showAlert('registaration failed ','plz try again')

}}
