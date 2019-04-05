import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";



@Injectable()
export class ServerService {
  ipApiUrl: string = 'http://ip-api.com/json';
  serverZip: string = 'http://localhost:3000/api/zipauto/'; // needs prefix zip here
  serverFinding : string = 'http://localhost:3000/api/finding?';
  serverFindingFlag : string =  'http://localhost:3000/api/finding?';



  constructor(private http: HttpClient) {}

  getZipCodeAPI() {
    return this.http.get(this.ipApiUrl);
  }

  getAutoCompleteZip(zipPrefix) {
    const autoCompleteUrl = this.serverZip + zipPrefix;
    return this.http.get(autoCompleteUrl);
  }

  getEbayFindingService(formData) {
    this.serverFinding = this.serverFindingFlag;
    this.serverFinding += 'keywords=' + formData.keyword + '&';
    if (formData.categories !=="") {
      this.serverFinding += 'categoryId=' + formData.categories + '&';
    } else {
      this.serverFinding += 'categoryId=' + 'None' + '&';
    }
    this.serverFinding += 'buyerPostalCode=' + formData.Zip + '&';

    //condition
    if (!formData.new && !formData.use && !formData.unspecified) {
      this.serverFinding += 'condition[new]=NoCondition&';
    } else {
      if (formData.new) {
        this.serverFinding += 'condition[new]=true&';
      } else {
        this.serverFinding += 'condition[new]=false&';
      }

      if (formData.used) {
        this.serverFinding += 'condition[used]=true&';
      } else {
        this.serverFinding += 'condition[used]=false&';
      }

      if (formData.unspecified) {
        this.serverFinding += 'condition[unspecified]=true&';
      } else {
        this.serverFinding += 'condition[unspecified]=false&';
      }
    }


    //shipping
    if (!formData.freeshipping && !formData.localpickup) {
      this.serverFinding += 'shipping[freeshipping]=NoShippingOption&';
    } else {
      if (formData.freeshipping) {
        this.serverFinding += 'shipping[freeshipping]=true&';
      } else {
        this.serverFinding += 'shipping[freeshipping]=false&';
      }

      if (formData.localpickup) {
        this.serverFinding += 'shipping[localpickup]=true&';
      } else {
        this.serverFinding += 'shipping[localpickup]=false&';
      }
    }


    if (formData.Distance != "") {
      this.serverFinding += 'distance=' + formData.Distance + '&';
    } else {
      this.serverFinding += 'distance=10';
    }

    console.log(this.serverFinding);
    return this.http.get(this.serverFinding);
  }

  getEbayShoppingService(itemId) {
    let serviceShopping = 'http://localhost:3000/api/shopping?' + 'itemId=' + itemId;
    console.log(serviceShopping);
    return this.http.get(serviceShopping);
  }

  getGCSE(itemTitle) {
    itemTitle = encodeURI(itemTitle);
    let serviceGCSE = 'http://localhost:3000/api/gcse?q=' + itemTitle;
    console.log(serviceGCSE);
    return this.http.get(serviceGCSE);
  }

  getSimilarItems(itemId) {
    let serviceSimilar = 'http://localhost:3000/api/similar?' + 'itemId=' + itemId;
    return this.http.get(serviceSimilar);
  }

}

