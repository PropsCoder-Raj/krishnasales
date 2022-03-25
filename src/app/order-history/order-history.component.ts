import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from "../../environments/environment";
import { AuthService } from '../__helper/service/auth.service';
import { ngxCsv } from "ngx-csv/ngx-csv";
import { ModalController } from '@ionic/angular';
import { ItemsModalComponent } from '../items-modal/items-modal.component';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  @ViewChild('dataTable1') table1: any;
  dataTable:any;
  dataTable1:any;

  orderData = [];
  loading = true;
  loading1 = true;

  public viewOrderList = [];
  viewOrderListExportAscsv = [];
  public currency = environment.currency;
  Order_Id = '';
  EmpName = '';
  CusName = '';
  Order_Date = '';
  Amount = '';
  Status = '';
  Remark = '';

  ramdom = Math.floor(100000 + Math.random() * 900000);
  public currentUser : any;

  constructor(public router: Router, public title: Title, public http: HttpClient, public authService: AuthService, public modalController: ModalController) { }

  async openEditModal(items: any) {
    const modal = await this.modalController.create({
      component: ItemsModalComponent,
      componentProps: {'items': items}
    });
    return await modal.present();
  }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 3){
      this.router.navigate(['/customer-dashboard']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }
    this.title.setTitle("Order History | KrishnaSales");
    this.get_all_orders();
  }

  get_all_orders(){
    this.loading = true;
    this.orderData = [];
    this.http.get<any>(`${environment.apiUrl}/get-all-orders`).subscribe((item:any) => {
      this.loading = false;
      this.orderData = item.data;
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
      },300);
    });
  }

}
