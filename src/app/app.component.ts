import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthService } from './__helper/service/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // title = 'krishnasales';
  subtitle = '';
  public currentUser: any;
  public role:any;
  public loggedin:any
  constructor(public authService: AuthService, public title:Title,public modalController: ModalController) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user=>{
      if(user.User_Id !== "" && user.User_Id !== undefined){
        console.log(user.User_Id);
        this.currentUser = user;
        this.role = user.Role;
        this.loggedin = true;
        $("ion-router-outlet").addClass("router");
      }
    });
    this.subtitle = this.title.getTitle();

  }

  logout(){
    this.authService.logout();
  }

  async changePassword(){
    const modal = await this.modalController.create({
      component: ChangePasswordComponent
    });
    return await modal.present();
  }


  closeSidenav(){
    $("#appMain").removeClass("sidebar-mobile-open");
    $("#menuToggle").removeClass("is-active")
  }
}

