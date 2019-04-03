import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ResultTabComponent} from "./result-tab/result-tab.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";

import { ResultsRoutingModule } from './results-routing.module';
import {NgxPaginationModule} from "ngx-pagination";

import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material";
import {MatFormFieldModule} from "@angular/material";
import {MatInputModule} from "@angular/material";

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';

import {ProgressBarComponent} from "../progress-bar/progress-bar.component";

@NgModule({
  declarations: [
    ResultTabComponent,
    ProductDetailComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatPaginatorModule

  ]
})
export class ResultsModule { }