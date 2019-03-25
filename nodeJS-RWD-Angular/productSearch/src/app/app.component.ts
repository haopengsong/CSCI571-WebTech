import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  keywordValidation: boolean = false;
  keywordInput : string = "";

  onUserInput() {

  }

  onKeyWordValidation() {
    if (this.keywordInput !== "") {
      this.keywordValidation = true;
    }
  }
}
