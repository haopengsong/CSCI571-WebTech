import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResultTabComponent} from "./result-tab/result-tab.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {WishListComponent} from "./wish-list/wish-list.component";


const routes: Routes = [
  {path: 'result-tab', component: ResultTabComponent, data: {animation : 'resultTab' }},
  {path: 'product-detail', component: ProductDetailComponent, data : {animation : 'productDetail'}},
  {path: 'wish-list', component: WishListComponent, data: {animation: 'wishList'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule { }
