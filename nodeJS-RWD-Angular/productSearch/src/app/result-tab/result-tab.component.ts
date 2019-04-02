import {Component, Input, OnInit} from '@angular/core';
import {ServerService} from "../server.service";
import {Item} from "./item.model";
import {slideInAnimation} from "../animation";

@Component({
  selector: 'app-result-tab',
  templateUrl: './result-tab.component.html',
  styleUrls: ['./result-tab.component.css'],
  animations: [slideInAnimation]
})
export class ResultTabComponent implements OnInit {
  @Input() itemElements: Item[] = [];
  page: number = 1;
  pageSize: number = 10;
  constructor(private apiService: ServerService) { }

  ngOnInit() {
  }

  wishList: Map<string, Item> = new Map<string, Item>();


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
    this.apiService.getEbayShoppingService(item.itemID)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {

        }
      );
  }

  //router modification
  showErrorMessage: boolean = false;
}
