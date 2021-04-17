import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { AppServiceService } from "../../services/app-service.service"

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public authService: AuthenticationService, public router: Router, public appService: AppServiceService) { }

  ngOnInit() {}

  logIn(email, password) {
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
        this.router.navigate(['/home']);
      }).catch((error) => {
        this.appService.showErrorMsg(error.message);
      })
  }
}
