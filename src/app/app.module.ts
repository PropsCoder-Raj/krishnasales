import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderHistoryDetailsComponent } from './order-history-details/order-history-details.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { BonusMasterComponent } from './bonus-master/bonus-master.component';
import { CustomersComponent } from './customers/customers.component';
import { EmployeesComponent } from './employees/employees.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent, HeaderComponent, TopmenuComponent, SharedModule} from './shared';

import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserCreateOrderComponent } from './user-create-order/user-create-order.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { FilterPipe } from "../app/pipe/filter.pipe";
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeUsersComponent } from './employee-users/employee-users.component';
import { EmployeeOrderHistoryComponent } from './employee-order-history/employee-order-history.component';
import { DataTablesModule } from "angular-datatables";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ItemsModalComponent } from './items-modal/items-modal.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    TopmenuComponent,
    AppComponent,
    HomeComponent,
    OrderHistoryComponent,
    OrderHistoryDetailsComponent,
    ItemMasterComponent,
    BonusMasterComponent,
    CustomersComponent,
    EmployeesComponent,
    LoginComponent,
    UserDashboardComponent,
    UserCreateOrderComponent,
    UserOrderHistoryComponent,
    FilterPipe,
    EmployeeDashboardComponent,
    EmployeeUsersComponent,
    EmployeeOrderHistoryComponent,
    ItemsModalComponent,
    LoginPageComponent,
    ChangePasswordComponent
  ],
  entryComponents: [ItemsModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    DataTablesModule,
    IonicModule.forRoot(),
    CommonModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },],
  bootstrap: [AppComponent]
})
export class AppModule { }
