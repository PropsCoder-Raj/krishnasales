import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { element } from 'protractor';
import { environment } from "../../environments/environment";
import { AuthService } from '../__helper/service/auth.service';
import { ngxCsv } from "ngx-csv/ngx-csv";
import swal from 'sweetalert2';

@Component({
  selector: 'app-items-modal',
  templateUrl: './items-modal.component.html',
  styleUrls: ['./items-modal.component.scss']
})
export class ItemsModalComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  @ViewChild('dataTable1') table1: any;
  dataTable:any;
  dataTable1:any;

  currentUser: any;
  loading = true;
  loading1 = true;
  orderData = [];
  viewOrderList = [];
  viewOrderListExportAscsv = [];

  Order_Id = '';
  Name = '';
  EmpName = '';
  Order_Date = '';
  Amount = '';
  Status = '';
  Remark = '';

  
  public currency = environment.currency;

  item: any;

  constructor(public modalCtrl: ModalController, public http: HttpClient, public authService: AuthService, public navParams: NavParams) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.item = this.navParams.get('items');
    this.loading1 = true;
    if(this.viewOrderList.length !== 0){
      setTimeout(() =>{
        this.dataTable1 = $(this.table1.nativeElement);
        this.dataTable1.DataTable().clear().destroy();
      },300);
    }
    this.Order_Id = this.item.Order_Id;
    this.Name = this.item.Name;
    this.EmpName = this.item.EmpName;
    this.Order_Date = this.item.Order_Date_Format;
    this.Amount = this.item.Amount;
    this.Status = this.item.Status;
    this.Remark = this.item.Remark;
    this.viewOrderList = [];
    this.http.get<any>(`${environment.apiUrl}/get-user-order/` + this.item.Unique_Id).subscribe((res: any) =>{
      this.viewOrderList = res.data;
      let array = ['Item Description', 'Item No.', 'Quantity'];
      setTimeout(() =>{
        if(this.viewOrderList.length === res.data.length){
          this.viewOrderListExportAscsv.push(array);
          this.viewOrderList.forEach((element1 : any) => {
            let array1 = [element1['Item_Name'], element1['Item_Id'],  element1['Qty']];
            this.viewOrderListExportAscsv.push(array1);
          });
          this.loading1 = false;
          this.dataTable1 = $(this.table1.nativeElement);
          this.dataTable1.DataTable();
        }
      },300);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  dismissWithUpdate(status) {
    this.modalCtrl.dismiss({
      'Status': status
    });
  }

  results(id){
    new ngxCsv(this.viewOrderListExportAscsv, "Orders ORD-"+ id);
    this.dismiss();
  }

  update_status(id, status){
    let formData = new FormData();
    formData.append('Status', status);
    return this.http.post<any>(`${environment.apiUrl}/update-order-status/` + id, formData).subscribe((result=>{
      if(result.status == "success"){
        this.dismissWithUpdate('success');
        swal.fire('Successfully',"Order Updated",'success');
      }else {
        this.dismissWithUpdate('error');
        swal.fire('Error',result.message,'error');
      }
    }));
  }

}
