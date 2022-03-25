import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../__helper/service/auth.service';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.scss']
})
export class ItemMasterComponent implements OnInit {

  @ViewChild('dataTable') table: any;
  dataTable:any;

  addItemS = false;
  editItemS = false;
  importS = false;

  public itemno = '';
  public itemname = '';
  public quanttity = '';
  public tradeprice = '';
  public discount = '';
  public vat = '';
  public gross_amount = '';
  public stockS = '';
  public createItemFlag = false;
  public edit_ID = '';
  public currency = environment.currency;

  public loading = true;
  public itemdata = [];
  public file_data: any;
  public currentUser : any;

  constructor(public router:Router, public title: Title, public http:HttpClient, public authService: AuthService) { }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 3){
      this.router.navigate(['/customer-dashboard']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }

    this.title.setTitle("Item Master | KrishnaSales");
    this.get_all_items()
  }

  importOpen(){
    this.importS = true;
  }

  get_all_items(){
    if(this.itemdata.length !== 0){
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable().clear().destroy();
      },300);
    }
    this.loading = true;
    this.itemdata = [];
    this.http.get<any>(`${environment.apiUrl}/get-all-items`).subscribe((res: any) =>{
      this.loading = false;
      this.itemdata = res.data;
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
      },300);
    });
  }

  createItem(){
    let formData = new FormData();
    formData.append('Item_Id', this.itemno);
    formData.append('Item_Name', this.itemname);
    formData.append('Unit_Price', this.tradeprice);
    formData.append('Discount', this.discount);
    formData.append('Vat', this.vat);
    formData.append('Stock_State', this.stockS);
    this.http.post<any>(`${environment.apiUrl}/create-item-master`, formData).subscribe((result: any) => {
        if(result.status == "success"){
          this.get_all_items();
          swal.fire('Successfully','Create Item Master','success');
          this.createItemFlag = false;
          this.itemno = '';
          this.itemname = '';
          this.tradeprice = '';
          this.discount = '';
          this.vat = '';
          this.stockS = '';
        } else {
          swal.fire('Error',result.message,'error');
        }
    });
  }

  updateItem(){
      let formData = new FormData();
      formData.append('Item_Id', this.itemno);
      formData.append('Item_Name', this.itemname);
      formData.append('Unit_Price', this.tradeprice);
      formData.append('Discount', this.discount);
      formData.append('Vat', this.vat);
      formData.append('Stock_State', this.stockS);
      this.http.post<any>(`${environment.apiUrl}/update-item-master/` + this.edit_ID, formData).subscribe((result : any) => {
        if(result.status == "success"){
          this.get_all_items();
          swal.fire('Successfully','Edit Item Master','success');
          this.createItemFlag = false;
          this.itemno = '';
          this.itemname = '';
          this.tradeprice = '';
          this.discount = '';
          this.vat = '';
          this.stockS = '';
          this.edit_ID = '';
        } else {
          swal.fire('Error',result.message,'error');
        }
      });
  }

  deleteItem(id){
    this.http.get<any>(`${environment.apiUrl}/delete-item-master/` + id).subscribe((result : any) => {
      if(result.status == "success"){
        swal.fire('Successfully','Item Master Deleted','success');
        this.get_all_items();
      }else {
        swal.fire('Error',result.message,'error');
      }
    });
  }

  selectWebFile(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
        const file = fileList[0];
        if((file.size/1048576)<=4)
        {
          let formData = new FormData();
          formData.append('file', file, file.name);
          this.file_data=formData;
          swal.fire("File Validation Success",'','success');
        }else{
          swal.fire("Validation Failed", '', 'error');
        }
    }
  }

  uploadExcel(){
    if(this.file_data != ""){
      this.http.post<any>(`${environment.apiUrl}/post-excel-item-master-file`, this.file_data).subscribe((res:any) => {
          if(res.status == "success"){
            swal.fire("CSV File Uploaded",'','success');
            this.get_all_items();
            this.importS = false;
          } else {
            swal.fire(res.message, '', 'error');
          }
        }, (err) => {
          swal.fire(err, '', 'error');
      });
    } else {
      swal.fire('File Uploading error', '', 'error');
    }
  }

  setEditParam(id, edit_itemno, edit_itemname, edit_tradeprice, edit_discount, edit_vat, edit_stockS){
    this.itemno = edit_itemno;
    this.itemname = edit_itemname;
    this.tradeprice = edit_tradeprice;
    this.discount = edit_discount;
    this.vat = edit_vat;
    this.stockS = edit_stockS;
    this.edit_ID = id;
  }

  clearEditParam(){
    this.itemno = '';
    this.itemname = '';
    this.quanttity = '';
    this.tradeprice = '';
    this.discount = '';
    this.vat = '';
    this.gross_amount = '';
    this.stockS = '';
    this.edit_ID = '';
    this.createItemFlag = false;
  }

}
