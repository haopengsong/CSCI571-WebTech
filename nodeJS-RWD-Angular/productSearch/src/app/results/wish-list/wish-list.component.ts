import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Item} from "../result-tab/item.model";

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  wishListItems: [] = [];
  userInput: string = '';
  productDetailSearchTrigger: boolean;
  showErrorMessage: boolean = true;
  showResultTab: boolean = false;

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          if (params['userInput'] != undefined) {
            this.userInput = params['userInput'];
          }
        },
      );
    this.wishListItems = JSON.parse( localStorage.wishlistItems );
    if (this.wishListItems.length > 0) {
      this.showErrorMessage = false;
      this.showResultTab = true;
    }

  }


  onDetailButtonClicked() {

  }

  onTitleClicked(item: Item) {
    
  }

  onWishListClicked(item: Item) {
    
  }
}
