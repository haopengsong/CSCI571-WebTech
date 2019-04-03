import {Component, Input, OnInit} from '@angular/core';
import {ServerService} from "../../server.service";
import {Item} from "./item.model";
import {slideInAnimation} from "../../animation";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-result-tab',
  templateUrl: './result-tab.component.html',
  styleUrls: ['./result-tab.component.css'],
  animations: [slideInAnimation]
})
export class ResultTabComponent implements OnInit {
  items: Item[] = [
    // new Item(0,'','asdf','1111','asf',
    //   '111','asdf','a','2','', false)
  ];
  page: number = 1;


  userInput: string = '';
  constructor(
    private apiService: ServerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.userInput = params['userInput'];
          if (this.userInput != undefined) {
            this.serviceFinding(JSON.parse(this.userInput));
          }
          this.onSearchButtonClick();
          console.log(this.userInput);
        },
      );
  }

  wishList: Map<string, Item> = new Map<string, Item>();


  //router modification
  dataLoaded:boolean = false;
  showErrorMessage: boolean = false;
  showProgressBar: boolean = false;
  noRecords: boolean = false;
  productDetailSearchTrigger: boolean = false;

  onWishListClicked(item: Item) {
    if (!this.wishList.has(item.itemID)) {
      this.wishList.set(item.itemID, item);
      item.inList = 'remove_shopping_cart';
      item.inListFlag = true;
    } else {
      this.wishList.delete(item.itemID);
      item.inList = 'add_shopping_cart';
      item.inListFlag = false;
    }
  }

  onTitleClicked(item: Item) {
    this.productDetailSearchTrigger = true;

  }

  onSearchButtonClick() {
    this.showErrorMessage = false;
    this.showProgressBar = true;
    console.log('Search Button Clicked');
    setTimeout(() => this.showProgressBar = false, 500);
  }

  //data collected, parse data, call api
  serviceFinding(myform) {
    this.apiService.getEbayFindingService(myform)
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
            this.itemExtractor(response);
          }
        },
        (error) => {
          //todo : if finding service fails
        }
      );
  }

  onShowErrorMessage() {
    if (this.noRecords) {
      setTimeout(()=> this.showErrorMessage = true, 50);
      return;
    } else {
      console.log('good');
    }
  }

  //show result tab
  showResultTab: boolean = false;
  itemExtractor(response) {

    this.items = [];
    const itemArray = response['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
    for (let i = 0; i < itemArray.length; i++) {
      let newItem = new Item(0,'','','','',
        '','','','','', false);
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
}
