import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../__helper/service/auth.service';

@Component({
  selector: 'app-bonus-master',
  templateUrl: './bonus-master.component.html',
  styleUrls: ['./bonus-master.component.scss']
})
export class BonusMasterComponent implements OnInit {
  
  @ViewChild('dataTable') table: any;
  dataTable:any;

  addItemS = false;
  editItemS = false;
  importS = false;

  public itemid = '';
  public quanttity = '';
  public discount = '';
  public loading = true;

  public edit_ID = '';

  createBonusFlag = false;

  public bonusdata = [];
  public itemdata = [];
  public dataList = [];

  public file_data: any;
  public currentUser: any;

  constructor(public router: Router, public title: Title, public http: HttpClient, public authService: AuthService) { }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 3){
      this.router.navigate(['/customer-dashboard']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }

    this.title.setTitle("Bonus Master | KrishnaSales");
    this.getAllBonus();
    this.http.get<any>(`${environment.apiUrl}/get-all-items`).subscribe((res: any) => {
      this.itemdata = res.data;
    });
  }

  importOpen() {
    this.importS = true;
  }

  getAllBonus() {
    if(this.bonusdata.length !== 0){
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable().clear().destroy();
      },300);
    }
    this.loading = true;
    this.bonusdata = [];
    this.http.get<any>(`${environment.apiUrl}/get-all-bonus`).subscribe((res: any) => {
      this.loading = false;
      this.bonusdata = res.data;
      setTimeout(() =>{
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
      },300);
    });
  }


  selectWebFile(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      if ((file.size / 1048576) <= 4) {
        let formData = new FormData();
        formData.append('file', file, file.name);
        this.file_data = formData;
        swal.fire("File Validation Success", '', 'success');
      } else {
        swal.fire("Validation Failed", '', 'error');
      }
    }
  }

  uploadExcel() {
    if (this.file_data != "") {
      this.http.post<any>(`${environment.apiUrl}/post-excel-bonus-master-file`, this.file_data).subscribe((res: any) => {
        if (res.status == "success") {
          swal.fire("CSV File Uploaded", '', 'success');
          this.importS = false;
          this.ngOnInit();
          this.bonusdata = [];
        } else {
          swal.fire(res.message, '', 'error');
        }
      }, (err) => {
        console.error(err);
      });
    } else {
      swal.fire('File Uploading error', '', 'error');
    }
  }

  addBonusMaster() {
    let formData = new FormData();
    formData.append('Quantity', this.quanttity);
    formData.append('Discount', this.discount);
    this.http.post<any>(`${environment.apiUrl}/create-bonus-master/` + this.itemid, formData).subscribe((result: any) => {
      if (result.status == "success") {
        this.createBonusFlag = false;
        swal.fire('Successfully', 'Bonus Created', 'success');
        this.itemid = '';
        this.quanttity = '';
        this.discount = '';
        this.getAllBonus();
      } else {
        swal.fire('Error', result.message, 'error');
      }
    });
  }

  updateBonusMaster() {
    let formData = new FormData();
    formData.append('Item_Id', this.itemid);
    formData.append('Quantity', this.quanttity);
    formData.append('Discount', this.discount);
    this.http.post<any>(`${environment.apiUrl}/update-bonus-master/` + this.edit_ID, formData).subscribe((result: any) => {
      if (result.status == "success") {
        this.createBonusFlag = false;
        swal.fire('Successfully', 'Bonus Edited', 'success');
        this.itemid = '';
        this.quanttity = '';
        this.discount = '';
        this.edit_ID = '';
        this.getAllBonus();
      } else {
        swal.fire('Error', result.message, 'error');
      }
    });
  }

  delete(id) {
    this.http.post<any>(`${environment.apiUrl}/delete-bonus-master/` + id, id).subscribe((result: any) => {
      if(result.status == "success"){
        swal.fire('Successfully','Bonus Deleted','success');
        this.getAllBonus();
      }else {
        swal.fire('Error',result.message,'error');
      }
    });
  }

  setEditParam(id, quanttity, discount) {
    this.itemid = id;
    this.quanttity = quanttity;
    this.discount = discount;
    this.edit_ID = id;
  }

  clearEditParam() {
    this.itemid = '';
    this.quanttity = '';
    this.discount = '';
    this.edit_ID = '';
  }

}
