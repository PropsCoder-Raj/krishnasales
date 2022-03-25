import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BonusMasterComponent } from './bonus-master/bonus-master.component';
import { CustomersComponent } from './customers/customers.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeOrderHistoryComponent } from './employee-order-history/employee-order-history.component';
import { EmployeeUsersComponent } from './employee-users/employee-users.component';
import { EmployeesComponent } from './employees/employees.component';
import { HomeComponent } from './home/home.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginComponent } from './login/login.component';
import { OrderHistoryDetailsComponent } from './order-history-details/order-history-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { UserCreateOrderComponent } from './user-create-order/user-create-order.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { AuthGuard } from './__helper/guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate :[AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'login-page', component: LoginPageComponent },
  { path: 'order-history', component: OrderHistoryComponent ,canActivate :[AuthGuard]},
  { path: 'order-history-details', component: OrderHistoryDetailsComponent ,canActivate :[AuthGuard]},
  { path: 'item-master', component: ItemMasterComponent ,canActivate :[AuthGuard]},
  { path: 'bonus-master', component: BonusMasterComponent ,canActivate :[AuthGuard]},
  { path: 'customer', component: CustomersComponent ,canActivate :[AuthGuard]},
  { path: 'employees', component: EmployeesComponent ,canActivate :[AuthGuard]},


  { path: 'customer-dashboard', component: UserDashboardComponent ,canActivate :[AuthGuard]},
  { path: 'customer-create-order', component: UserCreateOrderComponent ,canActivate :[AuthGuard]},
  { path: 'customer-order-history', component: UserOrderHistoryComponent ,canActivate :[AuthGuard]},

  
  { path: 'employee-dashboard', component: EmployeeDashboardComponent ,canActivate :[AuthGuard]},
  { path: 'employee-customers', component: EmployeeUsersComponent ,canActivate :[AuthGuard]},
  { path: 'employee-order-history', component: EmployeeOrderHistoryComponent ,canActivate :[AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
