import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";
import { AuthService } from '../__helper/service/auth.service';
import { ModalController } from '@ionic/angular';
import { ItemsModalComponent } from '../items-modal/items-modal.component';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  @ViewChild('dataTable1') table1: any;
  dataTable:any;
  dataTable1:any;

  totalOrders = 0;
  pendinngOrders = 0; 
  confirmOrders = 0;
  cancelOrder = 0;
  public currency = environment.currency;

  currentUser: any;
  loading = true;
  loading1 = true;
  orderData = [];
  viewOrderList = [];
  viewOrderListExportAscsv = [];

  Order_Id = '';
  Name = '';
  Order_Date = '';
  Amount = '';
  Status = '';
  Remark = '';

  constructor(public router: Router, public title: Title, public http: HttpClient, public authService: AuthService, public modalController: ModalController) { }

  async openEditModal(items: any) {
    const modal = await this.modalController.create({
      component: ItemsModalComponent,
      componentProps: {'items': items}
    });

    modal.onDidDismiss()
      .then((data) => {
        const user = data['data'];
        if(user['Status'] === 'success' || user['Status'] === 'error'){
          this.getOrders();
        }
    });

    return await modal.present();
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 1){
      this.router.navigate(['/']);
    }else if(this.currentUser['Role'] == 3){
      this.router.navigate(['/customer-dashboard']);
    }
    this.title.setTitle("Employee Dashboard | KrishnaSales");
    this.get_user_orders();
    this.getAllCount();
  }

  getAllCount(){
    this.totalOrders = 0;
    this.pendinngOrders = 0; 
    this.confirmOrders = 0;
    this.cancelOrder = 0;

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-count-from-employee/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.totalOrders = res.data.length;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-pending-count-from-employee/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.pendinngOrders = res.data.length;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-confirm-count-from-employee/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.confirmOrders = res.data.length;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-cancel-count-from-employee/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.cancelOrder = res.data.length;
    });
  }

  getOrders(){
    this.orderData = [];
    this.loading = true;
    
    this.http.get<any>(`${environment.apiUrl}/get-orders-from-user-latest-seven-days-employee/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.orderData = res.data;
      this.loading = false;
    });
  }

  get_user_orders(){
    this.orderData = [];
    this.loading = true;
    if(this.orderData.length !== 0){
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable().clear().destroy();
      },300);
    }
    
    
    this.http.get<any>(`${environment.apiUrl}/get-orders-from-user-latest-seven-days-employee/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.orderData = res.data;
      this.loading = false;
      setTimeout(() =>{
          this.dataTable = $(this.table.nativeElement);
          this.dataTable.DataTable();
      },300);
    });
  }

}
