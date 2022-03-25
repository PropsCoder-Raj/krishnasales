import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../__helper/service/auth.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  dataTable:any;

  addItemS = false;
  editItemS = false;

  public Employee_Name = '';
  public Email = '';
  public Mobile = '';
  public Designation = '';
  public Password = '';
  public createEmployeeFlag = false;


  public edit_Employee_Name = '';
  public edit_Email = '';
  public edit_Mobile = '';
  public edit_Designation = '';
  public edit_Password = '';
  public edit_ID = '';

  loading = true;

  public empdata = [];
  public currentUser : any;
    
  constructor(public router:Router, public title: Title, public http: HttpClient, public authService: AuthService) { }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 3){
      this.router.navigate(['/customer-dashboard']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }
    
    this.title.setTitle("Employees | KrishnaSales");
    this.get_all_employees()
  }

  get_all_employees(){
    if(this.empdata.length !== 0){
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable().clear().destroy();
      },300);
    }
    this.loading = true;
    this.empdata = [];
    this.http.get<any>(`${environment.apiUrl}/get-all-employees`).subscribe((res: any) =>{
      this.loading = false;
      this.empdata = res.data;
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
      },300);
    });
  }

  add(){
    this.addItemS = true;
    let addCard = document.getElementById('createItemCard');
    addCard.style.display = 'block';
  }

  createEmployee(){
    let formData = new FormData();
    formData.append('Name', this.Employee_Name);
    formData.append('Email', this.Email);
    formData.append('Mobile', this.Mobile);
    formData.append('Designation', this.Designation);
    formData.append('Password', this.Password);
    this.http.post<any>(`${environment.apiUrl}/create-employee`, formData).subscribe((result: any) =>{
        if(result.status == "success"){
          swal.fire('Successfully','Create Employee','success');
          this.get_all_employees();
          this.Employee_Name = '';
          this.Email = '';
          this.Mobile = '';
          this.Designation = '';
          this.Password = '';
        }else {
          swal.fire('Error',result.message,'error');
        }
    });
  }

  updateEmployee(){
    let formData = new FormData();
    formData.append('Name', this.Employee_Name);
    formData.append('Email', this.Email);
    formData.append('Mobile', this.Mobile);
    formData.append('Designation', this.Designation);
    formData.append('Password', this.Password);
    return this.http.post<any>(`${environment.apiUrl}/update-employee/` + this.edit_ID, formData).subscribe((result=>{
      if(result.status == "success"){
        this.get_all_employees();
        this.Employee_Name = '';
        this.Email = '';
        this.Mobile = '';
        this.Designation = '';
        this.Password = '';
        this.edit_ID = '';
        swal.fire('Successfully','Edit Employee','success');
      }else {
        swal.fire('Error',result.message,'error');
      }
    }));
  }

  delete(id){
    let formData = new FormData();
    formData.append('Employee_Id', id);
    return this.http.get<any>(`${environment.apiUrl}/delete-employee/` + id).subscribe((result: any) => {
      if(result.status == "success"){
        this.get_all_employees();
        swal.fire('Successfully','Delete Employee','success');  
      }else {
        swal.fire('Error',result.message,'error');
      }
    })
  }


  setEditParam(id, eempname, eemial, emobile, edesign, password){
    this.Employee_Name = eempname;
    this.Email = eemial;
    this.Mobile = emobile;
    this.Designation = edesign;
    this.Password = password;
    this.edit_ID = id;
  }

  clearEditParam(){
    this.Employee_Name = '';
    this.Email = '';
    this.Mobile = '';
    this.Designation = '';
    this.Password = '';
    this.edit_ID = '';
  }

}
