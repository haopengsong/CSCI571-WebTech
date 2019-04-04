import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResultTabComponent} from "./result-tab/result-tab.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";


const routes: Routes = [
  {path: 'result-tab', component: ResultTabComponent, data: {animation : 'resultTab' }},
  {path: 'product-detail', component: ProductDetailComponent, data : {animation : 'productDetail'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule { }
