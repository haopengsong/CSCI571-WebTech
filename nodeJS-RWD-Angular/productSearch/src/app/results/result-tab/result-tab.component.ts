import {Component, Input, OnInit} from '@angular/core';
import {ServerService} from "../../server.service";
import {Item} from "./item.model";
import {slideInAnimation} from "../../animation";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {shippingInfo} from "./shippinginfo.model";
import {Sellerinfo} from "./sellerinfo.model";

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
  itemIdSelectedfromDetailPage: string = '';

  constructor (
    private apiService: ServerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.userInput = params['userInput'];

          if (params['id'] != undefined) {
            this.itemIdSelectedfromDetailPage = params['id'];
            this.productDetailSearchTrigger = true;
          }
          if (this.userInput != undefined) {
            this.showResultTab = false;
            this.showProgressBar = true;
            this.showErrorMessage = false;
            this.serviceFinding(JSON.parse(this.userInput));
            setTimeout(() => this.showProgressBar = false, 500);
          } else {
            return;
          }
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
   // console.log(item);

    if (!this.wishListHas(item)) {
      item.inList = 'remove_shopping_cart';
      item.inListFlag = true;
      this.addToLocalStorage(item);
    } else {
      item.inList = 'add_shopping_cart';
      item.inListFlag = false;
      this.deleteFromLocalStorage(item);
    }
  }

  onTitleClicked(item: Item) {
    this.productDetailSearchTrigger = true;
    this.router.navigate (
      [
        '/product-detail',
        {
          userInput: this.userInput ,
          shippingInfo : JSON.stringify(item.shippingInfo),
          sellerInfo : JSON.stringify(item.sellerInfo) ,
          id : item.itemID
        }
      ]
    );
  }

  wishListHas(item: Item) {
    if (localStorage.wishlistItems) {
      let inwishList = [];
      inwishList = JSON.parse(localStorage.wishlistItems);
      for (let i = 0; i < inwishList.length; i++) {
        if (inwishList[i].itemID == item.itemID) {
          return true;
        }
      }
    }
    return false;
  }

  deleteFromLocalStorage(item: Item) {
    if (localStorage.wishlistItems) {
      let inwishList = JSON.parse( localStorage.wishlistItems );
      for (let i = 0; i < inwishList.length; i++) {
        if (item.itemID == inwishList[i].itemID) {
          inwishList.splice(i, 1);
          break;
        }
      }
      localStorage.wishlistItems = JSON.stringify(inwishList);
    }
  }

  addToLocalStorage(item: Item) {
    let wishListArr = [];
    if (localStorage.wishlistItems) {
        wishListArr = JSON.parse(localStorage.wishlistItems);
        wishListArr.push(item);
        localStorage.wishlistItems = JSON.stringify(wishListArr);
    } else {
      wishListArr.push(item);
      localStorage.wishlistItems = JSON.stringify(wishListArr);
    }
    console.log(localStorage);
  }

  checkLocalStorageBeforeDisplayItems() {
    if (localStorage.wishlistItems) {
      let inwishList = [];
      inwishList = JSON.parse(localStorage.wishlistItems);
      this.items.forEach((a) => {
        inwishList.forEach((b) => {
          if (a.itemID == b.itemID) {
            a.inListFlag = true;
            a.inList = 'remove_shopping_cart';
          }
        });
      });
    }
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
        '','','','','', false, null, null);
      let shippinginfo = new shippingInfo('','','','','','');
      let sellerInfo = new Sellerinfo('','','','','','', '');
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
          newItem.price = itemArray[i]['sellingStatus'][0]['currentPrice'][0]['__value__'];
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
            shippinginfo.cost = 'Free Shipping';
          } else if (itemArray[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] != "" &&
            itemArray[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] != null) {
            newItem.shippingOption = '$'+ itemArray[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];
            shippinginfo.cost = itemArray[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];
          } else {
            newItem.shippingOption = 'N/A';
          }
        } else {
          newItem.shippingOption = 'N/A';
        }
        if (itemArray[i]['shippingInfo'][0]['shipToLocations'] != undefined) {
          shippinginfo.location = itemArray[i]['shippingInfo'][0]['shipToLocations'];
        }
        if (itemArray[i]['shippingInfo'][0]['handlingTime'] != undefined) {
         if (+itemArray[i]['shippingInfo'][0]['handlingTime'][0] > 1) {
           shippinginfo.handling = itemArray[i]['shippingInfo'][0]['handlingTime'][0] + ' Days';
         } else {
           shippinginfo.handling = itemArray[i]['shippingInfo'][0]['handlingTime'][0] + ' Day';
         }
        }
        if (itemArray[i]['shippingInfo'][0]['expeditedShipping'] != undefined) {
          shippinginfo.expediated = itemArray[i]['shippingInfo'][0]['expeditedShipping'];
        }
        if (itemArray[i]['shippingInfo'][0]['oneDayShippingAvailable'] != undefined) {
          shippinginfo.oneDay = itemArray[i]['shippingInfo'][0]['oneDayShippingAvailable'];
        }
      } else {
        newItem.shippingOption = 'N/A';
      }
      //returns
      if (itemArray[i]['returnsAccepted'] != undefined) {
        shippinginfo.returnAccept = itemArray[i]['returnsAccepted'];
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
        if (itemArray[i]['sellerInfo'][0]['feedbackScore'] != undefined) {
          sellerInfo.feedbackScore = itemArray[i]['sellerInfo'][0]['feedbackScore'][0];
        }
        if (itemArray[i]['sellerInfo'][0]['positiveFeedbackPercent'] != undefined) {
          sellerInfo.popularity = itemArray[i]['sellerInfo'][0]['positiveFeedbackPercent'][0];
        }
        if (itemArray[i]['sellerInfo'][0]['feedbackRatingStar'] != undefined) {
          sellerInfo.feedbackRatingStar = itemArray[i]['sellerInfo'][0]['feedbackRatingStar'][0];
        }
        if (itemArray[i]['sellerInfo'][0]['topRatedSeller'] != undefined) {
          sellerInfo.topRated = itemArray[i]['sellerInfo'][0]['topRatedSeller'][0];
        }
        if (itemArray[i]['sellerInfo'][0]['sellerUserName'] != undefined) {
          sellerInfo.userID = itemArray[i]['sellerInfo'][0]['sellerUserName'][0];
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
      newItem.shippingInfo = shippinginfo;
      newItem.sellerInfo = sellerInfo;
      this.items.push(newItem);
    }
    this.checkLocalStorageBeforeDisplayItems();
    this.showResultTab = true;
  }

  onDetailButtonClicked() {
    let detailedItem = this.findItemByID(this.itemIdSelectedfromDetailPage);
    if (detailedItem != undefined) {
      this.router.navigate(
        [
          '/product-detail',
          {
            userInput: this.userInput ,
            shippingInfo : JSON.stringify(detailedItem.shippingInfo),
            sellerInfo : JSON.stringify(detailedItem.sellerInfo) ,
            id : detailedItem.itemID
          }
        ]
      );
    } else {
      console.log('no such element');
    }
  }

  findItemByID(itemID: string) {

    return this.items.find( (obj) => {
      return obj.itemID == itemID;
    });
  }
}
