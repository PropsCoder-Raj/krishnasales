import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../__helper/service/auth.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  dataTable:any;

  addItemS = false;
  editItemS = false;

  public Customer_Name = '';
  public Email = '';
  public Mobile = '';
  public Password = '';
  public Employee_Id = '';
  public loading = true;

  public edit_ID = '';

  createCustomerCardFlag = false;

  public customerdata = [];
  public empdata :any;
  public currentUser: any;

  constructor(public router:Router, public title: Title, public http: HttpClient, public authService: AuthService) { }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 3){
      this.router.navigate(['/customer-dashboard']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }
    
    this.title.setTitle("Customers | KrishnaSales");
    this.getAllBonus();

    this.http.get<any>(`${environment.apiUrl}/get-all-employees`).subscribe((res: any) =>{
      this.empdata = res.data;
    });
  }

  getAllBonus(){
    if(this.customerdata.length !== 0){
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable().clear().destroy();
      },300);
    }
    this.loading = true;
    this.customerdata = [];
    this.http.get<any>(`${environment.apiUrl}/get-all-customers`).subscribe((item: any) => {
      this.loading = false;
      this.customerdata = item.data;
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
      },300);
    });
  }

  addCustomer(){
    let formData = new FormData();
    formData.append('Name', this.Customer_Name);
    formData.append('Email', this.Email);
    formData.append('Mobile', this.Mobile);
    formData.append('Password', this.Password);
    formData.append('Employee_Id', this.Employee_Id);
    this.http.post<any>(`${environment.apiUrl}/create-customer`, formData).subscribe(result=>{
      if(result.status == "success"){
        swal.fire('Successfully','Customer Created','success');
        this.Customer_Name = '';
        this.Email = '';
        this.Mobile = '';
        this.Password = '';
        this.createCustomerCardFlag = false;
        this.getAllBonus();
        this.clearEditParam();
      } else {
        swal.fire('Error',result.message,'error');
      }
    });

  }

  updateCustomer(){
    let formData = new FormData();
    formData.append('Name', this.Customer_Name);
    formData.append('Email', this.Email);
    formData.append('Mobile', this.Mobile);
    formData.append('Password', this.Password);
    formData.append('Employee_Id', this.Employee_Id);
    this.http.post<any>(`${environment.apiUrl}/update-customer/` + this.edit_ID, formData).subscribe(result =>{
      if(result.status == "success"){
        this.Customer_Name = '';
        this.Email = '';
        this.Mobile = '';
        this.Password = '';
        this.createCustomerCardFlag = false;
        this.edit_ID = "";
        this.clearEditParam();
        swal.fire('Successfully','Customer Updated','success');
        this.getAllBonus();
      } else {
        swal.fire('Error',result.message,'error');
      }
    });
  }

  delete(id){
    this.http.get<any>(`${environment.apiUrl}/delete-customer/` + id).subscribe(result=>{
      if(result.status == "success"){
        swal.fire('Successfully','Customer Deleted','success');
        this.getAllBonus();
      }else {
        swal.fire('Error',result.message,'error');
      }
    });
  }


  setEditParam(id, eempname, eemial, emobile, password, employee_id){
    this.Customer_Name = eempname;
    this.Email = eemial;
    this.Mobile = emobile;
    this.Password = password;
    this.Employee_Id = employee_id;
    this.edit_ID = id;
  }

  clearEditParam(){
    this.Customer_Name = "";
    this.Email = "";
    this.Mobile = "";
    this.Password = "";
    this.Employee_Id = "";
    this.edit_ID = "";
  }


}
