import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { AuthService } from '../__helper/service/auth.service';

@Component({
  selector: 'app-order-history-details',
  templateUrl: './order-history-details.component.html',
  styleUrls: ['./order-history-details.component.scss']
})
export class OrderHistoryDetailsComponent implements OnInit {
  routeData: any;
  orderData : any;

  itemData = [];
  loading = true;
  public currentUser : any;

  constructor(public route: ActivatedRoute, public title: Title, public http: HttpClient, public authService: AuthService, public router:Router) { }

  ngOnInit(): void {

    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser['Role'] == 1){
      this.router.navigate(['/']);
    }else if(this.currentUser['Role'] == 2){
      this.router.navigate(['/employee-dashboard']);
    }

    this.title.setTitle("Order History Details | KrishnaSales");

    this.route.queryParams.subscribe((res) => {
      this.routeData = res;
    });

    this.orderData = this.routeData;
    this.http.get<any>(`${environment.apiUrl}/get-all-user-orders`).subscribe((item:any) => {
      this.loading = false;
      item.data.forEach(data => {
        this.http.get<any>(`${environment.apiUrl}/get-user-item-master/` + data['Item_Id']).subscribe((item1:any) => {
          this.itemData.push(item1.data);
        });
      });
    });
  }

}
