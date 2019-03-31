import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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



@NgModule({
  declarations: [
    AppComponent,
    ResultTabComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
