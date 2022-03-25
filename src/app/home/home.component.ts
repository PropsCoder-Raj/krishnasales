import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { AuthService } from "../__helper/service/auth.service";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { ModalController } from '@ionic/angular';
import { ItemsModalComponent } from '../items-modal/items-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  @ViewChild('dataTable1') table1: any;
  @ViewChild('dataTable2') table2: any;
  dataTable:any;
  dataTable1:any;
  dataTable2:any;
  
  public currency = environment.currency;

  public totalCustomer = 0;
  public activeCustomer = 0;
  public totalEmp = 0;
  public activeEmp = 0;
  public totalOrders = 0;
  public pendinngOrders = 0;
  public confirmOrders = 0;
  public cancelOrder = 0;
  public orders = [];
  public empdata = [];
  public currentUser: any;

  viewOrderList = [];
  viewOrderListExportAscsv = [];
  Order_Id = '';
  Name = '';
  Order_Date = '';
  Amount = '';
  Status = '';
  Remark = '';

  loading = true;
  loadingEmp = true;
  loadingOrder = true;
  loading1 = true;

  constructor(public router: Router, public title: Title, public http: HttpClient, public authService: AuthService, public modalController: ModalController) { }

  async openEditModal(items: any) {
    const modal = await this.modalController.create({
      component: ItemsModalComponent,
      componentProps: {'items': items}
    });
    return await modal.present();
  }

  ngOnInit() {

    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 3){
      this.router.navigate(['/customer-dashboard']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }
    
    this.title.setTitle("Dashboard | KrishnaSales");

    this.http.get<any>(`${environment.apiUrl}/get-all-employees`).subscribe((res: any) =>{
      res.data.forEach(element => {
        this.http.get<any>(`${environment.apiUrl}/get-total-customer-count/` + element['User_Id']).subscribe((customer: any) =>{
          this.http.get<any>(`${environment.apiUrl}/get-total-orders-pending-count-from-employee/` + element['User_Id']).subscribe((pending: any) =>{
            this.http.get<any>(`${environment.apiUrl}/get-total-orders-confirm-count-from-employee/` + element['User_Id']).subscribe((confirm: any) =>{
              this.http.get<any>(`${environment.apiUrl}/get-total-orders-cancel-count-from-employee/` + element['User_Id']).subscribe((cancel: any) =>{
                Array.prototype.push.apply(element, [{ tCustomer: customer.data, pOrder : pending.data.length, cOrder: confirm.data.length, c1Order: cancel.data.length}]);
                this.empdata.push(element);
              });  
            });    
          });
        });
      });
      setInterval(() => {
        if(this.empdata.length === res.data.length){
          this.loadingEmp = false;
          this.dataTable = $(this.table.nativeElement);
          this.dataTable.DataTable();
          clearInterval();
        }
      }, 1000);
    });

    this.http.get<any>(`${environment.apiUrl}/get-all-orders`).subscribe((res: any) =>{
      this.loadingOrder = false;
      this.orders = res.data;
      setTimeout(() =>{
        this.dataTable1 = $(this.table1.nativeElement);
        this.dataTable1.DataTable();
      },300);
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-employees-count`).subscribe((res: any) =>{
      this.loading = false;
      this.totalEmp = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-employees-active-count`).subscribe((res: any) =>{
      this.loading = false;
      this.activeEmp = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-customers-count`).subscribe((res: any) =>{
      this.loading = false;
      this.totalCustomer = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-customers-active-count`).subscribe((res: any) =>{
      this.loading = false;
      this.activeCustomer = res.data;
    });




    this.http.get<any>(`${environment.apiUrl}/get-total-orders-count`).subscribe((res: any) =>{
      this.loading = false;
      this.totalOrders = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-pending-count`).subscribe((res: any) =>{
      this.loading = false;
      this.pendinngOrders = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-confirm-count`).subscribe((res: any) =>{
      this.loading = false;
      this.confirmOrders = res.data;
    });

    this.http.get<any>(`${environment.apiUrl}/get-total-orders-cancel-count`).subscribe((res: any) =>{
      this.loading = false;
      this.cancelOrder = res.data;
    });

  }

}
