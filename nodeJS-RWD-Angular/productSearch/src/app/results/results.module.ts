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

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NorecordsComponent} from "../norecords/norecords.component";

import {RoundProgressModule} from 'angular-svg-round-progressbar';

import {FacebookModule} from "ngx-facebook";



@NgModule({
  declarations: [
    ResultTabComponent,
    ProductDetailComponent,
    ProgressBarComponent,
    NorecordsComponent
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
    MatPaginatorModule,
    NgbModule,
    RoundProgressModule,
    FacebookModule.forRoot()
  ],

  exports: [
    NorecordsComponent
  ]
})
export class ResultsModule { }
