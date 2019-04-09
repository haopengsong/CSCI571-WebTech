import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Item} from "../result-tab/item.model";

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  private itemIdSelectedfromDetailPage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  wishListItems: [] = [];
  userInput: string = '';
  productDetailSearchTrigger: boolean = false;
  showErrorMessage: boolean = true;
  showResultTab: boolean = false;
  totalShopping: number = 0;
  itemDeleted: string = '';
  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          if (params['userInput'] != undefined) {
            this.userInput = params['userInput'];
          }
          if (params['id'] != undefined) {
            this.itemIdSelectedfromDetailPage = params['id'];
            this.productDetailSearchTrigger = true;
          }
          if (params['itemDeleted'] != undefined) {
            this.itemDeleted = params['itemDeleted'];
            if (this.itemDeleted == 'true') {
              this.productDetailSearchTrigger = false;
            } else {
              this.productDetailSearchTrigger = true;
            }
          }
        },
      );
    if (localStorage.wishlistItems) {
      this.showErrorMessage = false;
      this.showResultTab = true;
      this.wishListItems = JSON.parse( localStorage.wishlistItems );
      if (this.wishListItems.length > 0) {
        this.showErrorMessage = false;
        this.showResultTab = true;
      } else {
        this.showErrorMessage = true;
        this.showResultTab = false;
      }
      this.totalSum(this.wishListItems);
    } else {
      this.showErrorMessage = true;
      this.showResultTab = false;
    }
  }
  totalshoppingRes: string = '';
  totalSum(items: Item[]) {
    for (let i = 0; i < items.length; i++) {
      this.totalShopping += +items[i].price;
    }
    this.totalshoppingRes = this.totalShopping.toFixed(2);

  }

  decreaseSum(item: Item) {
    this.totalShopping -= +item.price;
    this.totalshoppingRes = this.totalShopping.toFixed(2);
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

  onDetailButtonClicked() {
    let detailedItem: Item;
    let inlist = '';
    let inlistflag = '';
    detailedItem = this.findItemByID(this.itemIdSelectedfromDetailPage);
    if (detailedItem != undefined) {
      if (this.wishListHas(detailedItem)) {
        inlist = 'remove_shopping_cart';
        inlistflag = 'true';
      } else {
        inlist = 'add_shopping_cart';
        inlistflag = 'false';
      }
      this.router.navigate(
        [
          '/product-detail',
          {
            userInput: this.userInput ,
            shippingInfo : JSON.stringify(detailedItem.shippingInfo),
            sellerInfo : JSON.stringify(detailedItem.sellerInfo) ,
            id : detailedItem.itemID,
            where: 'wishList',
            inlist: inlist,
            inlistflag: inlistflag
          }
        ]
      );
    } else {
     // console.log('no such element');
    }
  }
  findItemByID(itemID: string) {
    return this.wishListItems.find( (obj: Item) => {
      return obj.itemID == itemID;
    });
  }


  onWishListClicked(item: Item) {
    item.inList = 'add_shopping_cart';
    item.inListFlag = false;
    this.deleteFromLocalStorage(item);
    this.wishListItems = JSON.parse( localStorage.wishlistItems );

    if (this.wishListItems.length == 0) {
      this.showErrorMessage = true;
      this.showResultTab = false;
    }

    //this.totalSum(this.wishListItems);
  }


  deleteFromLocalStorage(item: Item) {
    if (localStorage.wishlistItems) {
      let inwishList = JSON.parse( localStorage.wishlistItems );
      for (let i = 0; i < inwishList.length; i++) {
        if (item.itemID == inwishList[i].itemID) {
          this.decreaseSum(item);
          inwishList.splice(i, 1);
          break;
        }
      }
      localStorage.wishlistItems = JSON.stringify(inwishList);
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
          id : item.itemID,
          where: 'wishList',
          inlist: 'remove_shopping_cart',
          inlistflag: 'true',
          itemData: JSON.stringify(item)
        }
      ]
    );
  }
}
