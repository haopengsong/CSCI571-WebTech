import {Component, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ServerService} from "../../server.service";
import {Item} from "../result-tab/item.model";
import {FacebookService, InitParams, UIParams, UIResponse} from "ngx-facebook";


export class Entry {
  entryName: string;
  entryValue: string;
}

export class ItemDetails {

  title: string;
  picArray: any;
  subTitle: string;
  price: string;
  location: string;
  returnPolicy: string;
  ViewItemURLForNaturalSearch: string;
  inlist: string;
  inlistflag: string;
  itemSpecs: Entry[];

}

export class SimilarItem {
  constructor(
    public productName: string,
    public buyitNowprice: number,
    public shippingCost: number,
    public daysLeft: string,
    public imgUrl: string,
    public title: string,
    public viewItemURL: string
  ){}
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  @ViewChild('orderSelection') select: ElementRef;
  itemId: string = '';
  itemDetail: ItemDetails;
  contentLoaded: boolean = false;
  showErrorMessage: boolean = false;
  entry: Entry;

  //tab implementation
  tabSelector: boolean[] = [true, false, false, false, false];
  //gcse photo
  photoTab: string[] = [];
  //shipping info
  shippingInfo: any;
  //seller info
  sellerInfo: any;
  //similar items
  similarItems: SimilarItem[];
  //order selected
  //userInput back to result-tab
  userInput: string;
  //where
  where: string = '';
  //wish list spec
  inlist: string = '';
  inlistflag: string = '';
  itemData: string = '';

  constructor(
    private apiService: ServerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FacebookService
  ) {
    let initParams: InitParams = {
      appId            : '363321984511702',
      xfbml            : true,
      version          : 'v3.2'
    };
    fb.init(initParams);
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          if (params['where'] != undefined) {
            this.where = params['where'];
          } else {
            this.where = '';
          }
          this.itemId = params['id'];
          if (params['shippingInfo'] != undefined) {
            this.shippingInfo = JSON.parse(params['shippingInfo']) ;
          }
          if (params['userInput'] != undefined) {
            this.userInput = params['userInput'];
          }
          if (params['sellerInfo'] != undefined) {
            this.sellerInfo = JSON.parse((params['sellerInfo']));
          }
          if (params['inlist'] != undefined) {
            this.inlist = params['inlist'];
          }
          if (params['inlistflag'] != undefined) {
            this.inlistflag = params['inlistflag'];
          }
          if (this.itemId != undefined) {
            this.apiService.getEbayShoppingService(this.itemId)
              .subscribe(
                (response) => {
                  //console.log(response);
                  //extract info for item
                  this.itemDataExtractor(response);
                  setTimeout(()=> this.contentLoaded = !this.contentLoaded, 300);
                },
                (error) => {

                }
              );

          }
          if (params['itemData'] != undefined) {
            this.itemData = params['itemData'];
          }

        }
      );
  }


  //item details
  itemDataExtractor(jsonData) {
    if (jsonData['Ack'] != 'Success') {
      this.showErrorMessage = true;
      return;
    }
    this.itemDetail = new ItemDetails();
    this.itemDetail.itemSpecs = [];


   // console.log(jsonData);

    let itemData = jsonData['Item'];
    if (itemData['PictureURL'] != undefined) {
      this.itemDetail.picArray = itemData['PictureURL'];
    }

    if (itemData['Title'] != undefined) {
      this.itemDetail.title = itemData['Title'];
    }

    if (itemData['Subtitle'] != undefined) {
      this.itemDetail.subTitle = itemData['Subtitle'];
    }

    if (itemData['CurrentPrice'] != undefined) {
      this.itemDetail.price = itemData['CurrentPrice']['Value'];
    }

    if (itemData['Location'] != undefined) {
      this.itemDetail.location = itemData['Location'];
    }

    if (itemData['ReturnPolicy'] != undefined) {
      if (itemData['ReturnPolicy']['ReturnsAccepted'] == "Returns Accepted") {
         this.itemDetail.returnPolicy = itemData['ReturnPolicy']['ReturnsAccepted'] + " within " + itemData['ReturnPolicy']['ReturnsWithin'];
      } else {
        this.itemDetail.returnPolicy = itemData['ReturnPolicy']['ReturnsAccepted'];
      }
    }

    if (itemData['Storefront'] != undefined) {
      if (itemData['Storefront']['StoreName'] != undefined) {
        this.sellerInfo.storeName = itemData['Storefront']['StoreName'];
      }
      if (itemData['Storefront']['StoreURL'] != undefined) {
        this.sellerInfo.storeUrl = itemData['Storefront']['StoreURL'];
      }
    }

    if (itemData['ViewItemURLForNaturalSearch'] != undefined) {
      this.itemDetail.ViewItemURLForNaturalSearch = itemData['ViewItemURLForNaturalSearch'];
    }

    if (itemData['ItemSpecifics'] != undefined) {
      let itemSpec = itemData['ItemSpecifics']['NameValueList'];
      let itemSpecLen = itemSpec.length;
      for (let i = 0; i < itemSpecLen; i++) {
        let entryName = itemSpec[i]['Name'];
        let entryValue = itemSpec[i]['Value'];
        if (entryValue.length > 0) {
          this.entry = new Entry();
          this.entry.entryName = entryName ;
          this.entry.entryValue = entryValue[0] ;
          this.itemDetail.itemSpecs.push(this.entry);
        }
      }
    }

    this.itemDetail.inlist = this.inlist;
    this.itemDetail.inlistflag = this.inlistflag;
  }

  onTabClicked(id: any) {
    this.showErrorMessage = false;
    this.tabSelector.fill(false);
    this.tabSelector[ +id ] = true;

    //photo tab
    if ( +id == 1) {
      this.apiService.getGCSE(this.itemDetail.title)
        .subscribe(
          (response) => {

            this.photoDataExtractor(response);
          },
          (error) => {
            this.onNoRecords(1);
          }
        );
    }

    //shipping
    if ( +id == 2) {
      if (this.shippingInfo.cost == '' &&  this.shippingInfo.location == ''
        && this.shippingInfo.handling == '' && this.shippingInfo.expediated == ''
        && this.shippingInfo.oneDay == '' && this.shippingInfo.returnAccept == '') {

        this.onNoRecords(2);
      }
    }

    //similar
    if ( +id == 4) {
      this.apiService.getSimilarItems(this.itemId)
        .subscribe(
          (response2) => {
           // console.log(response2);
            this.sortButton = true;
            this.itemSimilarExtractor(response2);
          },
          (error) => {
            this.onNoRecords(4);
          }
        );
    }

  }
  sortButton: boolean = true;
  //item similar
  itemSimilarExtractor(similarData) {
    this.similarItems = [];


    if (similarData["getSimilarItemsResponse"]['ack'] != 'Success') {
      this.onNoRecords(4);
      this.sortButton = false;
      return;
    }

    let itemsArray = similarData["getSimilarItemsResponse"]['itemRecommendations']['item'];
    if (itemsArray == undefined || itemsArray == null || itemsArray.length == 0) {
      this.onNoRecords(4);
      this.sortButton = false;
      return;
    }

    for (let i = 0; i < itemsArray.length; i++) {
      let si = new SimilarItem('',-1,-1,'','','','');
      if (itemsArray[i]['title'] != undefined) {
        si.productName = itemsArray[i]['title'];
      }
      if (itemsArray[i].hasOwnProperty('buyItNowPrice')) {
        if (itemsArray[i]['buyItNowPrice']['__value__'] == "0.00") {
          if (itemsArray[i].hasOwnProperty('currentPrice') && itemsArray[i]['currentPrice']['__value__'] != "0.00") {
            si.buyitNowprice = +itemsArray[i]['currentPrice']['__value__'] ;
          } else {
            si.buyitNowprice = +itemsArray[i]['buyItNowPrice']['__value__'] ;
          }
        } else {
          si.buyitNowprice = +itemsArray[i]['buyItNowPrice']['__value__'] ;
        }
      }

      if (itemsArray[i]['shippingCost'] != undefined) {
        si.shippingCost = +itemsArray[i]['shippingCost']['__value__'];
      }

      if (itemsArray[i]['imageURL'] != undefined) {
        si.imgUrl = itemsArray[i]['imageURL'];
      }

      if (itemsArray[i]['title'] != undefined) {
        si.title = itemsArray[i]['title'];
      }

      if (itemsArray[i]['viewItemURL'] != undefined) {
        si.viewItemURL = itemsArray[i]['viewItemURL'];
      }

      if (itemsArray[i]['timeLeft'] != undefined) {
        let dl = itemsArray[i]['timeLeft'];
        si.daysLeft = dl.substring(1,2);
      }
      this.similarItems.push(si);

    }
    this.similarItemsSorted = JSON.parse(JSON.stringify(this.similarItems)) ;
    this.itemLength = this.similarItemsSorted.length;
    this.isLessFive = this.similarItemsSorted.length;
  }

  photoDataExtractor(response) {
   // console.log(response);
    this.photoTab = [];
    let photoItems = response['items'];
    if ( photoItems == undefined || photoItems.length == 0 ) {
      //photo tab error
      this.onNoRecords(1);
      return;
    }
    for (let i = 0; i < photoItems.length; i++) {
      this.photoTab.push(photoItems[i]['link']);
    }
  }

  onNoRecords(tabID) {
    this.showErrorMessage = true;
    //this.tabSelector[tabID] = false;
    this.sortButton = false;
  }

  defaultOrder: boolean = true;
  isAsc: boolean = true;
  similarItemsSorted: any;
  currCategories: string = '';

  onOrderSelect(event: any) {
    let index = event.target.selectedIndex;
    let option = event.target.options[index].value;

    //sort
    if (option == 'default') {
      this.similarItemsSorted = JSON.parse(JSON.stringify(this.similarItems)) ;
      if (this.currCategories != 'default') {
        this.currCategories = 'default';
      } else {

        this.isAsc = true;
      }
      this.defaultOrder = true;
    } else {
      this.currCategories = option;
      this.defaultOrder = false;
      this.onSorting(option);
    }
  }

  onSorting(option) {
    if (this.defaultOrder) {
      this.onSortAsc(option);

    } else {
      if (this.isAsc) {
        this.onSortAsc(option);
      } else {
        this.onSortDes(option);
      }
    }
  }

  onSortDes(option) {
    if (option == 'price') option = 'buyitNowprice';
    this.similarItemsSorted.sort((a, b) => {
      return a[option] === b[option] ? 0 : a[option] > b[option] ? -1 : 1;
    });
  }

  onSortAsc(option) {
    if (option == 'price') option = 'buyitNowprice';
    this.similarItemsSorted.sort((a, b) => {
      return a[option] === b[option] ? 0 : a[option] > b[option] ? 1 : -1;
    });
  }

  onSortOption(event: any) {
    let index = event.target.selectedIndex;
    let option = event.target.options[index].value;
    if (option == 'asc') {
      this.isAsc = true;
    } else {
      this.isAsc = false;
    }
    this.onSorting(this.currCategories);
  }


  showButtonText: string = 'Show More';
  showMoreOrLess: boolean = true;
  startPage: number = 0;
  PageLimit: number = 5;
  itemLength: number;
  isLessFive: number;
  itemDeleted: boolean = false;
  onShowMore() {
    this.PageLimit = +this.similarItemsSorted.length;
  }

  onShowLess() {
    this.PageLimit = 5;
  }

  onListButtonClicked() {
   // console.log(this.router.config);
    if (this.where == 'wishList') {
      this.router.navigate(
        [
          '/wish-list',
          {
            id : this.itemId,
            userInput : this.userInput,
            itemDeleted: this.itemDeleted ? 'true' : 'false'
          }
        ]
      );
    } else {
      this.router.navigate(
        [
          '/result-tab',
          {id : this.itemId, userInput : this.userInput}
        ]
      );
    }
  }

  quoteFBshare: string = '';
  onShareBtn() {
    this.quoteFBshare = `Buy ${this.itemDetail.title} at $${this.itemDetail.price} from link below`;
    let fburl = 'https://www.facebook.com/dialog/share?';
    fburl += 'app_id=363321984511702';
    fburl += '&display=popup';
    fburl += '&href=' + encodeURI(this.itemDetail.ViewItemURLForNaturalSearch);
    fburl += '&quote=' + encodeURI(this.quoteFBshare);
    window.open(fburl);


  }




  onWishListClicked() {
    if (this.itemDetail.inlistflag == 'true') {
      this.itemDetail.inlistflag = 'false';
      this.itemDetail.inlist = 'add_shopping_cart';
      this.deleteFromLocalStorage();
      this.itemDeleted = true;
    } else {
      this.itemDetail.inlistflag = 'true';
      this.itemDetail.inlist = 'remove_shopping_cart';
      this.addToLocalStorage(JSON.parse(this.itemData));
      this.itemDeleted = false;
    }
  }


  deleteFromLocalStorage() {
    if (localStorage.wishlistItems) {
      let inwishList = JSON.parse( localStorage.wishlistItems );
      for (let i = 0; i < inwishList.length; i++) {
        if (this.itemId == inwishList[i].itemID) {
          inwishList.splice(i, 1);
          break;
        }
      }
      localStorage.wishlistItems = JSON.stringify(inwishList);
    }
  }

  addToLocalStorage(item: Item) {
    item.inListFlag = true;
    item.inList = 'remove_shopping_cart';
    let wishListArr = [];
    if (localStorage.wishlistItems) {
      wishListArr = JSON.parse(localStorage.wishlistItems);
      wishListArr.push(item);
      localStorage.wishlistItems = JSON.stringify(wishListArr);
    } else {
      wishListArr.push(item);
      localStorage.wishlistItems = JSON.stringify(wishListArr);
    }
    //console.log(localStorage);
  }
}
