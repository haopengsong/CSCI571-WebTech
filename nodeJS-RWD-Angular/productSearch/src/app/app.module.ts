import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {ServerService} from "./server.service";
import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material";
import {MatFormFieldModule} from "@angular/material";
import {MatInputModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ResultTabComponent } from './result-tab/result-tab.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';


const appRoutes: Routes = [

  {path: 'result-tab', component: ResultTabComponent},
  {path: 'product-detail', component: ProductDetailComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ResultTabComponent,
    ProductDetailComponent,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserAnimationsModule,
    FormsModule,
    MatTooltipModule,
    MatPaginatorModule,
    NgxPaginationModule,
  ],
  providers: [ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
