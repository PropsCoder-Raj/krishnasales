import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from "../../environments/environment";
import { AuthService } from '../__helper/service/auth.service';

@Component({
  selector: 'app-employee-users',
  templateUrl: './employee-users.component.html',
  styleUrls: ['./employee-users.component.scss']
})
export class EmployeeUsersComponent implements OnInit {

  currentUser: any;
  loading = true;
  customerdata = [];

  constructor(public router: Router, public title: Title, public http: HttpClient, public authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 1){
      this.router.navigate(['/']);
    }else if(this.currentUser['Role'] == 3){
      this.router.navigate(['/customer-dashboard']);
    }
    this.getAllUser();
    this.title.setTitle("Employee - Users | KrishnaSales");

  }

  getAllUser(){
    this.loading = true;
    this.customerdata = [];
    this.http.get<any>(`${environment.apiUrl}/get-all-customers`).subscribe((item: any) => {
      this.loading = false;
      this.customerdata = item.data;
    });
  }

}
