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
  constructor(
    private apiService: ServerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.itemId = params['id'];
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

  itemDataExtractor(jsonData) {
    if (jsonData['Ack'] != 'Success') {
      this.showErrorMessage = true;
      return;
    }
    this.itemDetail = new ItemDetails();
    this.itemDetail.itemSpecs = [];


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

  //tab implementation
  tabSelector: boolean[] = [true, false, false, false, false];
  onTabClicked(id: any) {
    this.tabSelector.fill(false);
    this.tabSelector[ +id ] = true;
  }


  onPhotoTab() {
    this.apiService.getGCSE(this.itemDetail.title)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {

        }
      );
  }
}
