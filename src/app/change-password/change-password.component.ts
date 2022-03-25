import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../__helper/service/auth.service';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  user:any
  error:any;
  success:any;
  currentPassword = "";
  newPassword = "";
  confirmPassword = "";
  constructor(public modalController: ModalController,public authService: AuthService, public httpClient: HttpClient) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user:any)=>{
      this.user = user;
    });
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  updatePassword() {
    if(this.currentPassword != "" && this.newPassword != "" && this.confirmPassword != ""){
      console.log(this.currentPassword);
      console.log(this.user.Password);
      if(this.currentPassword == this.user.Password){
        if(this.newPassword == this.confirmPassword){
          this.httpClient.get(`${environment.apiUrl}/change-password/`+this.user.User_Id+"/"+this.newPassword).subscribe(()=>{
            swal.fire("Success","Password Successfully updated","success");
            this.user.Password = this.newPassword;
            localStorage.setItem('currentUser', JSON.stringify(this.user));
            this.dismiss();
          });
        } else {
          this.error = "Confirm Password Not Matched";  
        }
      } else {
        this.error = "Please enter valid Current Password";
      }
    } else {
      this.error = "All Fields Mandatory";
    }
  }

}
