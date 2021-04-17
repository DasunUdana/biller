import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { AppServiceService } from "../../services/app-service.service"

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  constructor( public authService: AuthenticationService, public router: Router, public appService: AppServiceService) { }

  ngOnInit() {}

  signUp(email, password){
    this.authService.RegisterUser(email.value, password.value)      
    .then((res) => {
        this.router.navigate(['/login']);
        this.appService.showSuccessMsg('User Successfully Created');
    }).catch((error) => {
      this.appService.showErrorMsg(error.message);
    })
}

}
