import {Component, Input, OnInit} from '@angular/core';
import {Item} from "./item.model";

@Component({
  selector: 'app-result-tab',
  templateUrl: './result-tab.component.html',
  styleUrls: ['./result-tab.component.css']
})
export class ResultTabComponent implements OnInit {
  @Input() itemElements: Item[] = [];

  constructor() { }

  ngOnInit() {
  }

}
