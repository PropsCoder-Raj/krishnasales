import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from "../../environments/environment";
import { AuthService } from '../__helper/service/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create-order',
  templateUrl: './user-create-order.component.html',
  styleUrls: ['./user-create-order.component.scss']
})
export class UserCreateOrderComponent implements OnInit {

  public itemdata = [];
  public searchtext = "";
  public serach:any;
  public totalAmount = 0;
  public currency = '';
  public loading = true;
  public remark = '';
  filterKeys = ['ItemId'];
  public currentUser : any;
  ramdom = 0;

  cartList = [];
  interval: any;
  itemCount = 10;
  orderPlaceS = false;
  totalDisplayed = 10;
  searchTextS = false;

  constructor(public title: Title, public http:HttpClient, public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 1){
      this.router.navigate(['/']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }
    this.title.setTitle("Create Order | KrishnaSales");
    this.get_item_data();
    this.currency = environment.currency;
  }

  onKeySearch(){
    this.searchTextS = true;
  }

  create_order(){
    this.ramdom = Date.now();
    this.orderPlaceS = true;
    let formData = new FormData();
    formData.append('Unique_Id', String(this.ramdom));
    formData.append('Customer_Id', this.currentUser['User_Id']);
    formData.append('Amount', String(this.totalAmount));
    formData.append('Remark', this.remark);
    this.http.post<any>(`${environment.apiUrl}/create-order`, formData).subscribe((bonus:any) => {
      this.remark = '';
      this.cartList.forEach(data => {
        let formData1 = new FormData();
        formData1.append('Order_Id', String(this.ramdom));
        formData1.append('Item_Id', data['data']['Item_Id']);
        formData1.append('Qty', data['quantity']);
        formData1.append('Price', data['grand_total']);
        formData1.append('Discount', data['discount']);
        formData1.append('Vat', data['data']['Vat']);
        this.http.post<any>(`${environment.apiUrl}/create-user-order`, formData1).subscribe((bonus:any) => {
          this.cartList.splice(data,1);
        });
      });
    });

    this.interval = setInterval(() => {
      if(this.cartList.length === 0){
        this.orderPlaceS = false;
        this.closeInterval();
        this.cartList = [];
        this.itemdata = [];
        this.get_item_data();
        swal.fire('Successfully', 'Order Placed', 'success');
      }
    }, 1000);
  }

  get_item_data(){
    this.totalAmount = 0;
    this.itemdata = [];
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/get-all-items-bonus`).subscribe((res: any) =>{
      this.loading = false;
      console.log(res);
      this.itemdata = res.data;
    });
  }

  closeInterval(){
    clearInterval(this.interval);
  }

  onKey(qty, id, dis, vat, price, bqty, bdis){
      let tAmt = 0;let disc = 0;let tradePrice = 0;let vat_Per = 0;let grand_total = 0;let disount = 0;
    if(qty >= bqty && bqty != 0){
       disount = bdis;
        tAmt = Number(price) * Number(qty);
        disc = Number(tAmt) / 100;
        tradePrice = Number(tAmt) - (Number(disc) * Number(bdis));
        vat_Per = Number(tradePrice) / 100;
        grand_total = Number(tradePrice) + (Number(vat_Per) * Number(vat));
    }else{
      disount = dis;
        tAmt = Number(price) * Number(qty);
        disc = Number(tAmt) / 100;
        tradePrice = Number(tAmt) - (Number(disc) * Number(dis));
        vat_Per = Number(tradePrice) / 100;
        grand_total = Number(tradePrice) + (Number(vat_Per) * Number(vat));
    }
    this.addGradPrice(id, grand_total, disount);
    this.addTotalAmount();
  }

  addTotalAmount(){
    if(this.cartList.length > 0){
      this.totalAmount = 0;
      this.cartList.forEach(data=>{
        this.totalAmount = this.totalAmount + Number(data['grand_total']);
      });
    }
  }

  addGradPrice(id, price, discount){
    for (let index = 0; index < this.cartList.length; index++) {
      if(this.cartList[index]['data']['Id'] === id){
        this.cartList[index]['grand_total'] = price;
        this.cartList[index]['discount'] = discount;
      }
    }
  }

  removeItem(index : number){
    this.cartList.splice(index,1);
    this.addTotalAmount();
  }

  add_cart(item, qty) {
    if(qty === ''){
      qty = 1;
    }
    let tAmt = 0;let disc = 0;let tradePrice = 0;let vat_Per = 0;let grand_total = 0;let disount = 0;
    if(Number(qty) >= Number(item.Bonus_Qty) && item.Bonus_Qty != 0){
       disount = item.Bonus_Discount;
        tAmt = Number(item.Unit_Price) * Number(qty);
        disc = Number(tAmt) / 100;
        tradePrice = Number(tAmt) - (Number(disc) * Number(item.Bonus_Discount));
        vat_Per = Number(tradePrice) / 100;
        grand_total = Number(tradePrice) + (Number(vat_Per) * Number(item.Vat));
    }else{
      disount = item.Discount;
        tAmt = Number(item.Unit_Price) * Number(qty);
        disc = Number(tAmt) / 100;
        tradePrice = Number(tAmt) - (Number(disc) * Number(item.Discount));
        vat_Per = Number(tradePrice) / 100;
        grand_total = Number(tradePrice) + (Number(vat_Per) * Number(item.Vat));
    }
    this.cartList.push({ data: item, discount: disount, grand_total: grand_total, quantity: qty });
    this.addTotalAmount();
  }

  moreItems(){
    this.totalDisplayed += 10;
    // let previousCount = this.itemCount;
    // this.itemCount = this.itemCount + 10;
    // this.interval = setInterval(() => {
    //   if(this.itemdata.length > 0){
    //     this.closeInterval();
    //     for (let index = previousCount; index < this.itemCount; index++) {
    //       this.itemdata1.push(this.itemdata[index]);
    //     }
    //   }
    // }, 1000);
  }

}
