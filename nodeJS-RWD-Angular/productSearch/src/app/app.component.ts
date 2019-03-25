import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  keywordValidation: boolean = false;
  keywordInput : string = "";

  onValidation() {

  }


  onUserInput(event : any) {
    this.keywordInput = event.target.value;
  }

  onKeyWordValidation() {
    if (this.keywordInput != "") {
      this.keywordValidation = false;
    } else {
      this.keywordValidation = true;
    }
  }
}
