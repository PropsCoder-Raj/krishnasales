import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../__helper/service/auth.service";


@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  public currentUser: any;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
  }

  logout(){
    this.authService.logout();
  }

}
