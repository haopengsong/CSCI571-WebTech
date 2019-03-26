import { Component } from '@angular/core';
import {ServerService} from "./server.service";



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

  onUserInput(event : any) {
    console.log(event);
    this.keywordInput = event.target.value;
    if (this.keywordInput != "") {
      this.keywordValidation = false;
      this.SearchButton = true;
    }
  }

  //3.1.4
  constructor(private apiService : ServerService) {}
  locationAcquired: boolean = false;
  resError : string = "";
  zipCode = "";

  onKeyWordValidation() {
    console.log('here :' + this.keywordInput);
    if (this.keywordInput != "") {
      this.keywordValidation = false;
      //try get user location based on IP

      this.apiService.getZipCodeAPI()
        .subscribe(
          (response) => {
            this.zipCode = response['zip'];
            this.locationAcquired = true;
          },
          //todo #1: error message when unable to get zipcode
          (error) => console.log(error)
        );
      //console.log(this.ipApiRes);
    } else {
      this.keywordValidation = true;
      this.SearchButton = false;
    }
  }
  /*

   */

  locationInput : string = "";
  zipCodeSelect: boolean = false;



  onLocationSelect() {
    if (!this.keywordValidation) {
      //has keyword
      this.SearchButton = false;
    } else {
      //no keyword

    }
  }

  onZipSelect() {
    if (!this.keywordValidation) {

    }
  }


}
