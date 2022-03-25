import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { environment } from "../../environments/environment";
import { ItemsModalComponent } from '../items-modal/items-modal.component';
import { AuthService } from '../__helper/service/auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  @ViewChild('dataTable1') table1: any;
  dataTable:any;
  dataTable1:any;

  totalOrders = 0;
  pendinngOrders = 0; 
  confirmOrders = 0;
  cancelOrder = 0;

  currentUser: any;
  loading = true;
  loading1 = true;
  orderData = [];
  viewOrderList = [];

  Order_Id = '';
  EmpName = '';
  Order_Date = '';
  Amount = '';
  Status = '';
  Remark = '';

  EmployeeName= '';
  EmployeeEmail= '';
  EmployeeMobile= '';
  
  public currency = environment.currency;

  constructor(public title: Title, public http: HttpClient, public authService: AuthService, public router: Router, public modalController: ModalController) { }

  async openEditModal(items: any) {
    const modal = await this.modalController.create({
      component: ItemsModalComponent,
      componentProps: {'items': items}
    });
    return await modal.present();
  }

  ngOnInit(): void {

    const haeder = document.getElementById("ActionHeader");
    // haeder.classList.remove("sidebar-mobile-open");
    
    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 1){
      this.router.navigate(['/']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }
    this.title.setTitle("Customer Dashboard | KrishnaSales");
    this.get_user_orders()

    this.http.get<any>(`${environment.apiUrl}/get-employee/` + this.currentUser.Employee_Id).subscribe((res: any) =>{
      this.EmployeeEmail = res.data.Email;
      this.EmployeeName = res.data.Name;
      this.EmployeeMobile = res.data.Mobile;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-count-from-user/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.totalOrders = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-pending-count-from-user/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.pendinngOrders = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-confirm-count-from-user/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.confirmOrders = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-cancel-count-from-user/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.cancelOrder = res.data;
    });
  }

  get_user_orders(){
    this.orderData = [];
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/get-orders-from-user-latest-seven-days/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.orderData = res.data;
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
      },300);
    });
  }

}
