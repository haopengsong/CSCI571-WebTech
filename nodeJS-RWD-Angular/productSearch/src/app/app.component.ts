import {Component, Input, OnInit} from '@angular/core';
import {ServerService} from "./server.service";
import { FormControl} from "@angular/forms";
import {FormData} from "./formdata";

import {slideInAnimation} from "./animation";
import {Router, RouterOutlet} from "@angular/router";

//todo: finish wish list
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})

export class AppComponent   {


  myControl = new FormControl();
  //3.1.1
  keywordValidation: boolean = false;
  keywordInput : string = "";
  SearchButton : boolean = false;

  //3.1.4
  constructor(
    private apiService : ServerService,
    private router: Router
  ) {}

  formInput = new FormData(
    '',
    '',
    {new: false ,used: false, unspecified: false},
    {localPickup: false, freeShipping: false},
    '',
    ''

    );


  locationAcquired: boolean = false;
  currentZipCode = "";

  onUserInput(event : any) {
    console.log(event);
    this.keywordInput = event.target.value;
    if (this.keywordInput != "") {
      this.keywordValidation = false;
      this.SearchButton = true;
    }
  }

  //3.1.4 obtain user location
  onKeywordFocus() {
    this.apiService.getZipCodeAPI()
      .subscribe(
        (response) => {
          this.currentZipCode = response['zip'];
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

  whichZip : boolean = false;

  onLocationSelect() {
    if (!this.keywordValidation) {
      //has keyword
      this.zipCodeSelect = false;
      this.zipValid = true;
      this.selectedZipCode = "";
      this.myControl.disable();
      console.log("selected zip code : " + this.selectedZipCode);
    }
    this.zipCodeEntered = false;
    this.whichZip = false;
  }


  onZipSelect(event : any) {
    console.log(event);
    if (!this.keywordValidation) {
      this.zipCodeSelect = true;
      this.whichZip = true;
      this.myControl.enable();
    }
  }

  onReset() {
    //todo #2: on reset has more actions to perform
    this.SearchButton = false;
  }


  //3.1.2 AutoComplete


  zipCodeOptions: string[] = [];
  zipPrefix: string = "";
  zipCodeEntered: boolean = false;
  validZipInput : string = "";
  zipValid : boolean = true;

  //call autocomplete method here
  onZipInput(event : any) {
    this.zipPrefix = event.target.value;
    if (this.zipPrefix == "") {
      this.selectedZipCode = "";
    }
    console.log(this.zipPrefix);

    if (this.zipPrefix.length >= 3) {
      const validatorZipAPI = /^[0-9]{3,5}$/;
      if (validatorZipAPI.test(this.zipPrefix)) {
        //console.log(this.zipPrefix);
        this.apiService.getAutoCompleteZip(this.zipPrefix)
          .subscribe(
            (response) => {
              console.log('api: ');
              console.log(response);
              this.zipCodeOptions = [];
              for (let i = 0; i < response['postalCodes'].length; i++) {
                this.zipCodeOptions.push(response['postalCodes'][i].postalCode);
              }
            },
            (error) => {
              console.log('error: ');
              console.log(error);
            }
          );
      }
    }
    //todo: need to check input zip code & once the input is valid, store
    //todo: the value into 'validZip' used as the latest value when user check
    //todo: CurrentLocation back and forth.
    const validatorZip = /^[0-9]{5}$/;
    if (!validatorZip.test(this.zipPrefix)) {
      this.zipValid = false;
    } else {
      console.log('valid zip entered');
      this.validZipInput = event.target.value;
      this.zipValid = true;
      this.zipCodeSelect = false;
    }
  }

  whichZipOtherZip : boolean = false;
  selectedZipCode : string = "";

  onZipCodeSelected(event : any) {
    console.log(event);
    if (event.option.value.length == 5) {
      this.selectedZipCode = event.option.value;
      console.log("selected zip code : " + this.selectedZipCode);
      this.zipCodeSelect = false;
      this.zipValid = true;
      this.zipCodeEntered = false;
      this.whichZipOtherZip = true;
    }
  }
  onZipCodeEntered() {
    if (this.zipPrefix == "" && this.selectedZipCode == "") {
      this.zipCodeEntered = true;
      this.zipCodeSelect = true;
    } else {
      this.zipCodeEntered = false;
      // todo : check zip code validity
    }
  }

  //fix the distance radio issue
  searchForProduct(myform: any) {
    //console.log(this.)
    if (!this.whichZip) {
      myform.value.Zip = this.currentZipCode;
    } else {
      if (this.whichZipOtherZip) {
        myform.value.Zip = this.selectedZipCode;
      } else {
        if (this.zipValid) {}
        myform.value.Zip = this.validZipInput;
      }
    }

    myform.value.keyword = encodeURI( this.formInput.keyword );
    console.log(myform);
    //send form data to result-tab
    this.router.navigate([
      '/result-tab',
      {
        userInput : JSON.stringify(myform.value)
      }
      ]
    );

  }

  //Results & Wish List Button
  resultWishListButton: boolean = true;

  onSearchButtonClick() {
    console.log('Search Button Clicked');
  }

  onResultsBtnClicked() {
    this.resultWishListButton = true;
  }

  onWishListBtnClicked() {
    this.resultWishListButton = false;
  }

  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}

