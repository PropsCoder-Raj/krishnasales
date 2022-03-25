import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from "../../environments/environment";
import { AuthService } from '../__helper/service/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ItemsModalComponent } from '../items-modal/items-modal.component';

@Component({
  selector: 'app-user-order-history',
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.scss']
})
export class UserOrderHistoryComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  @ViewChild('dataTable1') table1: any;
  dataTable:any;
  dataTable1:any;

  public orderData = [];
  loading = true;
  loading1 = true;
  currentUser: any;
  public currency = environment.currency;

  public viewOrderList = [];
  Order_Id = '';
  EmpName = '';
  Order_Date = '';
  Amount = '';
  Status = '';
  Remark = '';

  constructor(public title: Title, public http:HttpClient, public authService: AuthService, public router: Router, public modalController: ModalController) { }

  async openEditModal(items: any) {
    const modal = await this.modalController.create({
      component: ItemsModalComponent,
      componentProps: {'items': items}
    });
    return await modal.present();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 1){
      this.router.navigate(['/']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }
    this.get_user_orders();
    this.title.setTitle("Customer Order History | KrishnaSales");
  }

  get_user_orders(){
    this.orderData = [];
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/get-orders-from-user/` + this.currentUser.User_Id).subscribe((res: any) =>{
      this.loading = false;
      this.orderData = res.data;
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
      },300);
    });
  }

  

}
