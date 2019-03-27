import { Component } from '@angular/core';
import {ServerService} from "./server.service";
import { FormControl} from "@angular/forms";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {


  //3.1.1
  keywordValidation: boolean = false;
  keywordInput : string = "";
  SearchButton : boolean = false;

  //3.1.4
  constructor(private apiService : ServerService) {}
  locationAcquired: boolean = false;
  resError : string = "";
  zipCode = "";

  onUserInput(event : any) {
    console.log(event);
    this.keywordInput = event.target.value;
    if (this.keywordInput != "") {
      this.keywordValidation = false;
      this.SearchButton = true;
    }
  }

  onKeywordFocus() {
    console.log('focus');
    this.apiService.getZipCodeAPI()
      .subscribe(
        (response) => {
          this.zipCode = response['zip'];
          this.locationAcquired = true;
          console.log('focus');
        },
        //todo #1: error message when unable to get zipcode
        (error) => console.log(error)
      );
  }

  onKeyWordValidation() {
    console.log('here :' + this.keywordInput);
    if (this.keywordInput != "") {
      this.keywordValidation = false;
    } else {
      this.keywordValidation = true;
      this.SearchButton = false;
    }
  }

  locationInput : string = "";
  zipCodeSelect: boolean = false;

  onLocationSelect() {

    if (!this.keywordValidation) {
      //has keyword
      this.zipCodeSelect = false;
    }
  }

  onZipSelect() {
    if (!this.keywordValidation) {
      this.zipCodeSelect = true;
    }
  }

  onReset() {
    //todo #2: on reset has more actions to perform
    this.SearchButton = false;
  }


  //3.1.2 AutoComplete
  myControl = new FormControl();


}

