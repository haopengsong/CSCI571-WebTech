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

import { RouterModule, Routes } from '@angular/router';

import { ResultsModule } from './results/results.module';
import {ResultTabComponent} from "./results/result-tab/result-tab.component";
import { HomeComponent } from './home/home.component';




const appRoutes: Routes = [

  {path: 'result-tab', component: ResultTabComponent},
  {path: '', redirectTo : '/result-tab', pathMatch: 'full'},

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    MatTooltipModule,
    MatPaginatorModule,
    ResultsModule,


  ],
  providers: [ServerService],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
