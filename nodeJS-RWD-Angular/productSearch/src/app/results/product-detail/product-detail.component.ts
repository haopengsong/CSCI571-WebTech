import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ServerService} from "../../server.service";
import {Item} from "../result-tab/item.model";



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
   itemSpecs: Entry[];

}

export class SimilarItem {
  constructor(
    public productName: string,
    public buyitNowprice: string,
    public shippingCost: string,
    public daysLeft: string
  ){}
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
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
  constructor(
    private apiService: ServerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.itemId = params['id'];
          if (params['shippingInfo'] != undefined) {
            this.shippingInfo = JSON.parse(params['shippingInfo']) ;
          }
          if (params['sellerInfo'] != undefined) {
            this.sellerInfo = JSON.parse((params['sellerInfo']));
          }
          if (this.itemId != undefined) {
            this.apiService.getEbayShoppingService(this.itemId)
              .subscribe(
                (response) => {
                  console.log(response);
                  //extract info for item
                  this.itemDataExtractor(response);
                  setTimeout(()=> this.contentLoaded = !this.contentLoaded, 1000);
                },
                (error) => {

                }
              );

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


    console.log(jsonData);

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
            console.log(response2);
            this.itemSimilarExtractor(response2);
          },
          (error) => {
            this.onNoRecords(4);
          }
        );
    }

  }

  //item similar
  itemSimilarExtractor(similarData) {
    this.similarItems = [];


    if (similarData["getSimilarItemsResponse"]['ack'] != 'Success') {
      this.onNoRecords(4);
      return;
    }

    let itemsArray = similarData["getSimilarItemsResponse"]['itemRecommendations']['item'];
    if (itemsArray == undefined || itemsArray == null || itemsArray.length == 0) {
      this.onNoRecords(4);
      return;
    }

    for (let i = 0; i < itemsArray.length; i++) {
      let si = new SimilarItem('','','','');
      if (itemsArray['title'] != undefined) {
        si.productName = itemsArray['title'];
      }
      if (itemsArray[i].hasOwnProperty('buyItNowPrice')) {
        if (itemsArray[i]['buyItNowPrice']['__value__'] == "0.00") {
          if (itemsArray[i].hasOwnProperty('currentPrice') && itemsArray[i]['currentPrice']['__value__'] != "0.00") {
            si.buyitNowprice = itemsArray[i]['currentPrice']['__value__'] ;
          } else {
            si.buyitNowprice = itemsArray[i]['buyItNowPrice']['__value__'] ;
          }
        } else {
          si.buyitNowprice =itemsArray[i]['buyItNowPrice']['__value__'] ;
        }
      }

      if (itemsArray[i]['shippingCost'] != undefined) {
        si.shippingCost = itemsArray[i]['shippingCost'];
      }

      if (itemsArray[i]['timeLeft'] != undefined) {
        let dl = itemsArray[i]['timeLeft'];
        si.daysLeft = dl.substring(1,2);
      }

    }

  }

  photoDataExtractor(response) {
    console.log(response);
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
    this.tabSelector[tabID] = false;
  }

  defaultOrder: boolean = false;
  onOrderSelect($event: Event) {

  }
}
