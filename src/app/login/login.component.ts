import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../__helper/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email = '';
  public password = '';

  constructor(public authService: AuthService, public router: Router, public title: Title) { }

  ngOnInit(): void {

  }

  login(){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(this.email !== '' && this.password !== ''){
      if (re.test(this.email) == false) {
        swal.fire('','Email is not valid.','error');
      }else{
        this.authService.login(this.email,this.password).subscribe(user=>{
          if(user){
            if(user['Role'] === '1'){
              this.router.navigate(['/']);
            }else if(user['Role'] == '3'){
              this.router.navigate(['/customer-dashboard'])
            }else if(user['Role'] == '2'){
              this.router.navigate(['/employee-dashboard'])
            }
          }else{
            swal.fire('Error','User not found','error');
          }
          // this.router.navigate(['/']);
        })
      }
    }else{
      swal.fire('','All Fields are Mendatory','warning');
    }
  }

}
