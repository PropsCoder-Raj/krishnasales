import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from "../../__helper/service/auth.service";

@Component({
  selector: 'app-layout-topmenu',
  templateUrl: './topmenu.component.html'
})
export class TopmenuComponent implements OnInit {

  subtitle = '';
  public currentUser: any;

  constructor(public authService: AuthService, public title:Title) { }

  ngOnInit() {
    this.subtitle = this.title.getTitle();
    this.currentUser = this.authService.currentUserValue;
  }

  logout(){
    this.authService.logout();
  }

}
