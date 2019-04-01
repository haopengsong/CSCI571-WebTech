import {Component, Input, OnInit} from '@angular/core';
import {ServerService} from "./server.service";
import { FormControl} from "@angular/forms";
import {FormData} from "./formdata";
import {Item} from "./result-tab/item.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent   {
  // items: Item[] = [
  //   new Item('https://i-invdn-com.akamaized.net/content/pic787e8da1786a3b37b541d0bb4b211baa.jpg',
  //     'BTC', '20,000','BlockChain','90007','Coinbase'),
  //   new Item('https://i-invdn-com.akamaized.net/content/pic787e8da1786a3b37b541d0bb4b211baa.jpg',
  //     'BTC', '20,000','BlockChain','90007','Coinbase'),
  //   new Item('https://i-invdn-com.akamaized.net/content/pic787e8da1786a3b37b541d0bb4b211baa.jpg',
  //     'BTC', '20,000','BlockChain','90007','Coinbase'),
  //   new Item('https://i-invdn-com.akamaized.net/content/pic787e8da1786a3b37b541d0bb4b211baa.jpg',
  //     'BTC', '20,000','BlockChain','90007','Coinbase'),
  //   new Item('https://i-invdn-com.akamaized.net/content/pic787e8da1786a3b37b541d0bb4b211baa.jpg',
  //     'BTC', '20,000','BlockChain','90007','Coinbase')
  // ];
  items: Item[] = [];

  myControl = new FormControl();
  //3.1.1
  keywordValidation: boolean = false;
  keywordInput : string = "";
  SearchButton : boolean = false;

  //3.1.4
  constructor(
    private apiService : ServerService,
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
  resError : string = "";
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
    //3.2 results tab
    //1: call ebay API
    //encode keyword
    console.log(myform);
    myform.value.keyword = encodeURI( this.formInput.keyword );


    this.apiService.getEbayFindingService(myform.value)
      .subscribe(
        (response) => {
          //receive json result
          console.log(response);
          if (response.hasOwnProperty('findItemsAdvancedResponse') == false) {
            this.noRecords = true;
            this.onShowErrorMessage();
          } else if (response['findItemsAdvancedResponse'][0]['ack'] != 'Success') {
            this.noRecords = true;
            this.onShowErrorMessage();
          } else if (response['findItemsAdvancedResponse'][0]['searchResult'][0]['@count'] == '0') {
            this.noRecords = true;
            this.onShowErrorMessage();
          } else {
            this.itemExtractor(response)
          }
          // extract items from response

        },
        (error) => {
          //todo : if finding service fails
        }
      );
    // this.formInput = new FormData(
    //   '',
    //   '',
    //   {new: false ,used: false, unspecified: false},
    //   {localPickup: false, freeShipping: false},
    //   '',
    //   ''
    //
    // );
    console.log(myform.value);
  }

  //show result tab
  showResultTab: boolean = false;
  itemExtractor(response) {

    this.items = [];
    const itemArray = response['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
    for (let i = 0; i < itemArray.length; i++) {
      let newItem = new Item(0,'','','','',
        '','','','','');
      //index
      newItem.indexNumber = i+1;
      //image
      if (itemArray[i].hasOwnProperty('galleryURL') == true) {
        newItem.imagePath = itemArray[i]['galleryURL'];
      } else {
        newItem.imagePath = '#';
      }
      //title
      if (itemArray[i].hasOwnProperty('title') == true) {
        newItem.title = itemArray[i]['title'][0];
        if (newItem.title.length >= 35) {
          if (newItem.title[34] != ' ') {
            let cutPos = newItem.title.substring(0, 35).lastIndexOf(' ');
            newItem.titleCutted = newItem.title.substring(0, cutPos) + '...';
          } else {
            newItem.titleCutted = newItem.title.substring(0, 34) + '...';
          }
        } else {
          newItem.titleCutted = itemArray[i]['title'];
        }
      } else {
        newItem.title = 'N/A';
      }
      //price
      if (itemArray[i].hasOwnProperty('sellingStatus') == true) {
        if (itemArray[i]['sellingStatus'][0].hasOwnProperty('currentPrice') == true) {
          newItem.price = '$ '  + itemArray[i]['sellingStatus'][0]['currentPrice'][0]['__value__'];
        } else {
          newItem.price = 'N/A';
        }
      } else {
        newItem.price = 'N/A';
      }
      //shipping
      if (itemArray[i].hasOwnProperty('shippingInfo') == true) {
        if (itemArray[i]['shippingInfo'][0].hasOwnProperty('shippingServiceCost')== true) {
          if (itemArray[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] == "0.0") {
            newItem.shippingOption = 'Free Shipping';
          } else if (itemArray[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] != "" &&
            itemArray[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] != null) {
            newItem.shippingOption =  itemArray[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];
          } else {
            newItem.shippingOption = 'N/A';
          }
        } else {
          newItem.shippingOption = 'N/A';
        }
      } else {
        newItem.shippingOption = 'N/A';
      }
      //zip
      if (itemArray[i].hasOwnProperty('postalCode') == true) {
        newItem.zip = itemArray[i]['postalCode'][0];
      } else {
        newItem.zip = 'N/A';
      }
      //seller
      if (itemArray[i].hasOwnProperty('sellerInfo') == true) {
        if (itemArray[i]['sellerInfo'][0].hasOwnProperty('sellerUserName') == true) {
          newItem.seller = itemArray[i]['sellerInfo'][0]['sellerUserName'][0];
        } else {
          newItem.seller = 'N/A';
        }
      } else {
        newItem.seller = 'N/A';
      }
      //itemID
      if (itemArray[i].hasOwnProperty('itemId') == true) {
        newItem.itemID = itemArray[i]['itemId'][0];
      } else {
        newItem.itemID = 'noID';
      }
      newItem.inList = 'add_shopping_cart';
      this.items.push(newItem);
    }
    this.showResultTab = true;
  }

  //progress bar
  showProgressBar: boolean = false;
  //Results & Wish List Button
  resultWishListButton: boolean = true;
  //no records
  noRecords: boolean = false;
  showErrorMessage: boolean = false;

  onSearchButtonClick() {
    this.showErrorMessage = false;
    this.showProgressBar = true;
    console.log('Search Button Clicked');
    setTimeout(() => this.showProgressBar = false, 500);

  }

  onResultsBtnClicked() {
    this.resultWishListButton = true;
  }

  onWishListBtnClicked() {
    this.resultWishListButton = false;
  }

  onShowErrorMessage() {
    if (this.noRecords) {
      setTimeout(()=> this.showErrorMessage = true, 50);
      return;
    } else {
      console.log('good');
    }
  }

}

